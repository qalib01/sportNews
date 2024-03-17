const { Sequelize } = require('sequelize');
const db = require('../models/index');
const { sequelize } = require('../models/index');

const getHomePage = async (req, res, next) => {
    try {
        let lastNews = await db.news.findAll({
            limit: 6,
            where: {
                status: true
            },
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['title', 'key', 'img', 'createdBy', 'createdAt']
        });
        let trendNews = await db.news.findAll({
            limit: 6,
            include: [
                {
                    model: sequelize.model('categories'),
                    as: 'category',
                    where: {
                        status: true
                    }
                }
            ],
            where: {
                status: true,
                isTrend: true,
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
            ],
            where: {
                status: true
            },
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['title', 'key', 'img', 'createdBy', 'createdAt']
        });
        let allCategories = await db.categories.findAll({
            limit: 3,
            where: {
                status: true
            },
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: ['name', 'key', 'description']
        });
        let limitedTags = await db.tags.findAll({
            limit: 3,
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: ['name', 'key']
        });

        let newsTags = await db.news.findAll({
            include: [
                {
                    model: sequelize.model('news_tags'),
                    as: 'news_tags',
                    // attributes: [],
                    include: [
                        {
                            model: sequelize.model('tags'),
                            as: 'tag', 
                            attributes: ['name', 'key'],
                            // through: {
                            //     attributes: []
                            // }
                        }
                    ]
                }
            ],
            // attributes: ['id', 'title'],
            // raw: true,
        });

        // const newsWithTagCounts = {};
        const tagCounts = {};

        newsTags.forEach(news => {
            // console.log(news);
            // const { id, title, 'news_tags.tag.key':key} = news;
            // if (!newsWithTagCounts[id]) {
            //     newsWithTagCounts[id] = { title, tags: {}};
            // }
            // if (!newsWithTagCounts[id].tags[key]) {
            //     newsWithTagCounts[id].tags[key] = 1;
            // } else {
            //     newsWithTagCounts[id].tags[key]++;
            // }

            news.news_tags.forEach(news_tag => {
                console.log(news_tag.tag.name);
                // const tagName = news_tag.tag.name;
                // console.log(tagName);
                // if (!tagCounts[tagName]) {
                //     tagCounts[tagName] = 1;
                // } else {
                //     tagCounts[tagName]++;
                // }
            })
        });

        // return newsWithTagCounts;

        console.log(tagCounts);

        // const popularTags = await db.tags.findAll({
        //     include: [
        //         {
        //             model: sequelize.model('news_tags'),
        //             as: 'news_tag',
        //             include: [
        //                 {
        //                     model: sequelize.model('news'),
        //                     as: 'news',
        //                     required: false, // Use left join to include all news items even if they don't have any tags
        //                 }
        //             ],
        //         },
        //     ],
        //     // attributes: [[Sequelize.fn('COUNT', Sequelize.col('news_tags.newsId')), 'newsCount'], ],
        //     // group: ['tag.id'], // Assuming 'id' is the primary key of your Category model
        //     // order: [[Sequelize.literal('newsCount'), 'DESC']], // Sorting by newsCount in descending order
        //     limit: 3,
        // });


        // const popularTags = await db.tags.findAll({
        //     include: [
        //         {
        //             model: db.news_tags,
        //             as: 'news_tags', // This alias should match the one defined in the association
        //             include: [
        //                 {
        //                     model: db.news,
        //                     as: 'news',
        //                     required: false // Use left join to include all news items even if they don't have any tags
        //                 }
        //             ]
        //         }
        //     ],
        //     attributes: [
        //         'id', // Assuming 'id' is the primary key of your tags model
        //         [Sequelize.fn('COUNT', Sequelize.col('news_tags.newsId')), 'newsCount']
        //     ],
        //     group: ['tags.id'], // Assuming 'id' is the primary key of your tags model
        //     order: [[Sequelize.literal('newsCount'), 'DESC']], // Sorting by newsCount in descending order
        //     limit: 3
        // });

        // console.log(popularTags);
        res.render('index', {
            title: 'Ana səhifə',
            name: 'Ana səhifə',
            key: 'home',
            lastNews,
            allTags,
            trendNews,
            allNews,
            allCategories,
            limitedTags,
        });
    } catch (error) {
        console.error('Error in fetching homepage data:', error);
        next(error);
    }
}

const getAboutPage = function (req, res, next) {
    res.render('about', {
        title: 'Haqqımızda',
        name: 'Haqqımızda',
        key: 'about',
    });
}

module.exports = { getHomePage, getAboutPage }