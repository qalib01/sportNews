const { Sequelize } = require('sequelize');
const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
moment.locale('az');

const setMomentToLocals = async (req, res, next) => {
    res.locals.moment = moment;
    next();
}

const getPopularCategories = async (req, res, next) => {
    const popularCategories = await db.news.findAll({
        include: [
            {
                model: sequelize.model('categories'),
                as: 'category',
                attributes: ['name', 'key', 'description'],
                include: [
                    {
                        model: sequelize.model('sub_categories'),
                        as: 'sub_categories'
                    }
                ],
                where: {
                    status: true,
                },
                
            },
        ],
        where: {
            status: true,
            sharedAt: {
                [Op.lt]: moment().tz('Asia/Baku'),
            },
        },
        limit: 5,
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('news.categoryId')), 'newsCount'],],
        group: ['category.id'], // Assuming 'id' is the primary key of your Category model
        order: [[Sequelize.literal('newsCount'), 'DESC']], // Sorting by newsCount in descending order
    });
    res.locals.popularCategories = popularCategories;
    next();
}

const getListedCategories = async (req, res, next) => {
    const listedCategories = await db.categories.findAll({
        include: [
            {
                model: sequelize.model('sub_categories'),
                as: 'sub_categories',
                attributes: [ 'name', 'key', 'description' ],
            }
        ],
        attributes: [ 'name', 'key', 'description' ],
        where: {
            status: true,
            inOrder: {
                [Op.ne]: 0,
            }
        },
        order: [
            ['inOrder', 'ASC']
        ],
    });
    res.locals.listedCategories = listedCategories;
    next();
}

const getPopularNews = async (req, res, next) => {
    let limit = 3;
    try {
        let popularNews = await db.news.findAll({
            limit,
            order: [
                ['createdAt', 'ASC']
            ],
            where: {
                status: true,
                sharedAt: {
                    [Op.lt]: moment().tz('Asia/Baku'),
                },
            },
            attributes: ['title', 'key', 'img', 'createdBy', 'sharedAt']
        });

        res.locals.popularNews = popularNews;
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

const getLastThreeNews = async (req, res, next) => {
    let limit = 3;
    try {
        let lastThreeNews = await db.news.findAll({
            include: [
                {
                    model: sequelize.model('categories'),
                    as: 'category',
                    where: {
                        status: true,
                    }
                }
            ],
            limit,
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                status: true,
                sharedAt: {
                    [Op.lt]: moment().tz('Asia/Baku'),
                },
            },
            attributes: ['title', 'key', 'img', 'sharedAt']
        });

        res.locals.lastThreeNews = lastThreeNews;
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

const getPlatformSocialMedias = async (req, res, next) => {
    try {
        let platformSocialMedias = await db.platform_medias.findAll({
            where: {
                status: true,
            },
            include: [
                {
                    model: sequelize.model('social_medias'),
                    as: 'social_media',
                    where: {
                        type: 'media_social',
                    }
                }
            ]
        });

        res.locals.platformSocialMedias = platformSocialMedias;
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = { getPopularCategories, getListedCategories, getPopularNews, getLastThreeNews, setMomentToLocals, getPlatformSocialMedias }