const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
            .toUpperCase();
    };
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return (
        s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    );
};

let generateQueryOptions = (queryParams) => {
    let queryOptions = {
        include: [
            {
                model: sequelize.model('news_views'),
                as: 'news_view',
                attributes: ['viewsCounts'],
            },
            {
                model: sequelize.model('categories'),
                as: 'category',
                where: {
                    status: true,
                },
                attributes: ['name', 'key', 'description']
            }
        ],
        where: {
            status: true,
            sharedAt: {
                [Op.lt]: moment().tz('Asia/Baku'),
            },
        },
        order: [
            ['sharedAt', 'DESC']
        ],
        attributes: ['title', 'key', 'img', 'content', 'sharedAt'],
    };

    if (queryParams.category) {
        queryOptions.include.push({
            model: sequelize.model('categories'),
            as: 'category',
            where: {
                status: true,
                key: queryParams.category, // Filter category by key
            },
            attributes: ['name', 'key', 'description']
        });
        queryOptions.where['$news.categoryId$'] = { [Op.ne]: null };
    };

    if (queryParams.sub_category) {
        queryOptions.include.push({
            model: sequelize.model('sub_categories'),
            as: 'sub_category',
            where: {
                status: true,
                key: queryParams.sub_category, // Filter category by key
            },
            attributes: ['name', 'key', 'description']
        });
        queryOptions.where['$news.subCategoryId$'] = { [Op.ne]: null };
    }

    if (queryParams.tag) {
        queryOptions.include.push({
            model: sequelize.model('news_tags'),
            as: 'news_tags',
            include: [
                {
                    model: sequelize.model('tags'),
                    as: 'tag',
                    where: {
                        key: queryParams.tag, // Filter tags by key
                        status: true,
                    },
                    attributes: ['name', 'key', 'description']
                },
            ],
        });
        // queryOptions.where['$news_tags.tagId$'] = { [Op.ne]: null };
    };

    return queryOptions;
}

const getAllNews = async (req, res, next) => {
    const sevenDaysAgo = moment().tz('Asia/Baku').subtract(7, 'days').toDate();
    try {
        let allTags = await db.tags.findAll({
            where: {
                status: true,
            },
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: ['name', 'key']
        });

        const queryOptions = generateQueryOptions(req.query);
        let allNews = await db.news.findAll(queryOptions);
        let newsLength = allNews.length;

        const trendNews = allNews.filter(news => {
            let totalViews = 0;
            if (news.news_view) {
                totalViews = news.news_view.viewsCounts;
            }
            return totalViews > 0 && moment(news.sharedAt).isAfter(sevenDaysAgo);
        }).sort((a, b) => {
            let viewsA = 0;
            let viewsB = 0;
            if (a.news_view) {
                viewsA = a.news_view.viewsCounts;
            }
            if (b.news_view) {
                viewsB = b.news_view.viewsCounts;
            }
            return viewsB - viewsA;
        }).slice(0, 6);
        res.render('news', {
            title: 'Xəbərlər',
            name: 'Xəbərlər',
            key: 'news',
            allTags,
            trendNews,
            newsLength,
        });
    } catch (error) {
        console.error('Error in fetching homepage data:', error);
        next(error);
    }
}

const getNewsLoadMore = async (req, res, next) => {
    let limit = parseInt(req.query.limit);
    let startIndex = parseInt(req.query.startIndex) || 0;

    try {
        const queryOptions = generateQueryOptions(req.query);
        queryOptions.limit = limit;
        queryOptions.offset = startIndex;
        let allNews = await db.news.findAll(queryOptions);
    
        allNews = allNews.map((news) => {
            return {
                ...news.toJSON(),
                sharedAt: moment(news.sharedAt).format('LL'),
            }
        });
        res.json(allNews);
    } catch (error) {
        console.error('Error in fetching homepage data:', error);
        next(error);
    }
}

const getNewsDetail = async (req, res, next) => {
    let key = req.query.key;
    const sevenDaysAgo = moment().tz('Asia/Baku').subtract(7, 'days').toDate();
    let meta;
    if (!key || key == undefined || key == null) {
        next();
    }

    try {
        selectedNews = await db.news.findOne({
            include: [
                {
                    model: sequelize.model('news_tags'),
                    as: 'news_tags',
                    include: [
                        {
                            model: sequelize.model('tags'),
                            as: 'tag',
                            where: {
                                status: true,
                            },
                            attributes: ['name', 'key', 'description'],
                            required: false,
                        },
                    ],
                    attributes: '',
                },
                {
                    model: sequelize.model('categories'),
                    as: 'category',
                    attributes: ['name', 'key', 'description'],
                    where: {
                        status: true
                    }
                },
                {
                    model: sequelize.model('sub_categories'),
                    as: 'sub_category',
                    attributes: ['name', 'key', 'description'],
                },
                {
                    model: sequelize.model('news_views'),
                    as: 'news_view',
                    attributes: ['viewsCounts']
                },
            ],
            attributes: ['id', 'title', 'key', 'img', 'categoryId', 'content', 'metaKeywords', 'sharedAt'],
            where: {
                key,
                status: true,
                sharedAt: {
                    [Op.lt]: moment().tz('Asia/Baku'),
                },
            },
        });
        if (!selectedNews || selectedNews == null || selectedNews == undefined) {
            next();
        }

        let allNews = await db.news.findAll({
            include: [
                {
                    model: sequelize.model('categories'),
                    as: 'category',
                    where: {
                        id: selectedNews.categoryId,
                        status: true,
                    },
                    attributes: ['name', 'key', 'description'],
                },
                {
                    model: sequelize.model('news_tags'),
                    as: 'news_tags',
                    include: [
                        {
                            model: sequelize.model('tags'),
                            as: 'tag',
                            where: {
                                status: true
                            },
                            attributes: ['name', 'key', 'description'],
                        },
                    ],
                },
                {
                    model: sequelize.model('news_views'),
                    as: 'news_view',
                    attributes: ['viewsCounts']
                },
            ],
            where: {
                status: true,
                sharedAt: {
                    [Op.lt]: moment().tz('Asia/Baku'),
                },
            },
            order: [
                ['sharedAt', 'DESC']
            ],
            attributes: ['title', 'key', 'img', 'createdBy', 'sharedAt']
        });
        let allTags = await db.tags.findAll({
            where: {
                status: true,
            },
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: ['name', 'key']
        });

        const trendNews = allNews.filter(news => {
            let totalViews = 0;
            if (news.news_view) {
                totalViews = news.news_view.viewsCounts;
            }
            return totalViews > 0 && moment(news.sharedAt).isAfter(sevenDaysAgo);
        }).sort((a, b) => {
            let viewsA = 0;
            let viewsB = 0;
            if (a.news_view) {
                viewsA = a.news_view.viewsCounts;
            }
            if (b.news_view) {
                viewsB = b.news_view.viewsCounts;
            }
            return viewsB - viewsA;
        }).slice(0, 6);

        if (selectedNews) {
            let views = await db.news_views.findOne({
                where: {
                    newsId: selectedNews.id,
                }
            });

            if (!views) {
                await db.news_views.create({
                    id: guid(),
                    newsId: selectedNews.id,
                    viewsCounts: 1,
                });
            } else {
                const updatedCount = views.viewsCounts + 1; // Increment the count
                await db.news_views.update({
                    viewsCounts: updatedCount,
                },
                {
                    where: {
                        newsId: selectedNews.id,
                    }
                });
            };
        }

        res.render('news_detail', {
            title: selectedNews.title,
            name: selectedNews.title,
            key: 'news',
            selectedNews,
            allTags,
            trendNews,
            meta,
        });
    } catch (error) {
        return error;
    }
}

module.exports = { getAllNews, getNewsDetail, getNewsLoadMore }