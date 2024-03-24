const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment');
const now = new Date();


const getAllNews = async (req, res, next) => {
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    try {
        let allTags = await db.tags.findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: ['name', 'key']
        });
        let queryOptions = {
            include: [
                {
                    model: sequelize.model('news_views'),
                    as: 'news_view',
                    attributes: ['viewsCounts'],
                },
            ],
            where: {
                status: true,
                sharedAt: {
                    [Op.lt]: now,
                },
            },
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['title', 'key', 'img', 'content', 'createdAt'],
        };



        // Conditionally include category filtering if req.query.category is provided
        if (req.query.category) {
            queryOptions.include.push({
                model: sequelize.model('categories'),
                as: 'category',
                where: {
                    key: req.query.category, // Filter category by key
                    status: true,
                },
                attributes: ['name', 'key', 'description']
            });

            // queryOptions.where = {
            //     '$news.categoryId$': { [Op.ne]: null } // Ensure there's a category associated
            // };
        };

        // Conditionally include tag filtering if req.query.tag is provided
        if (req.query.tag) {
            queryOptions.include.push({
                model: sequelize.model('news_tags'),
                as: 'news_tags',
                include: [
                    {
                        model: sequelize.model('tags'),
                        as: 'tag',
                        where: {
                            key: req.query.tag, // Filter tags by key
                            status: true,
                        },
                        attributes: ['name', 'key', 'description']
                    },
                ],
            });

            // queryOptions.where = {
            //     '$news_tags.tagId$': { [Op.ne]: null }, // Ensure there's a tag associated
            // };
        };

        let allNews = await db.news.findAll(queryOptions);

        const trendNews = allNews.filter(news => {
            let totalViews = 0;
            if (news.news_view) {
                totalViews = news.news_view.viewsCounts;
            }
            return totalViews > 0 && moment(news.createdAt).isAfter(sevenDaysAgo);
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
            allNews,
            allTags,
            trendNews
        });
    } catch (error) {
        console.error('Error in fetching homepage data:', error);
        next(error);
    }
}

const getNewsDetail = async (req, res, next) => {
    let key = req.params.key;
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    let allNews = await db.news.findAll({
        include: [
            {
                model: sequelize.model('categories'),
                as: 'category',
                where: {
                    status: true
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
                [Op.lt]: now,
            },
        },
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: ['title', 'key', 'img', 'createdBy', 'createdAt']
    });
    let allTags = await db.tags.findAll({
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
        return totalViews > 0 && moment(news.createdAt).isAfter(sevenDaysAgo);
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
    let selectedNews = await db.news.findOne({
        include: [
            {
                model: sequelize.model('news_tags'),
                as: 'news_tags',
                include: [
                    {
                        model: sequelize.model('tags'),
                        as: 'tag',
                        attributes: ['name', 'key', 'description']
                    },
                ],
                attributes: ''
            },
            {
                model: sequelize.model('categories'),
                as: 'category',
                attributes: ['name', 'key', 'description']
            },
            {
                model: sequelize.model('news_views'),
                as: 'news_view',
                attributes: ['viewsCounts']
            },
        ],
        attributes: ['title', 'key', 'img', 'content', 'createdBy'],
        where: {
            key,
            // status: true
        },
    });
    res.render('news_detail', {
        title: selectedNews.title,
        name: selectedNews.title,
        key: 'news',
        selectedNews,
        allTags,
        trendNews,
    });
}

const getAllCategories = function (req, res, next) {
    res.render('category_list', {
        title: 'Category list'
    });
}

module.exports = { getAllNews, getNewsDetail, getAllCategories }