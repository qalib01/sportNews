const { Sequelize } = require('sequelize');
const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const { Op } = require('sequelize');
const moment = require('moment');
moment.locale('az');
let now = new Date();


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
            },
        ],
        limit: 5,
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('news.categoryId')), 'newsCount'],],
        group: ['category.id'], // Assuming 'id' is the primary key of your Category model
        order: [[Sequelize.literal('newsCount'), 'DESC']], // Sorting by newsCount in descending order
    });

    res.locals.popularCategories = popularCategories;
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
                sharedAt: {
                    [Op.lt]: now,
                },
            },
            attributes: ['title', 'key', 'img', 'createdBy']
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
            limit,
            order: [
                ['createdAt', 'DESC']
            ],
            where: {
                sharedAt: {
                    [Op.lt]: now,
                },
            },
            attributes: ['title', 'key', 'img', 'createdAt']
        });

        res.locals.lastThreeNews = lastThreeNews;
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = { getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals }