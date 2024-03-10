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
            limit: 4,
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