const { Sequelize } = require('sequelize');
const db = require('../models/index');
const { sequelize } = require('../models/index');
const moment = require('moment');
moment.locale('az');


const setMomentToLocals = async (req, res, next) => {
    res.locals.moment = moment;
    next();
}

const getPopularCategories = async (req, res, next) => {
    let limit = 5;
    // try {
    //     let popularCategories = await db.categories.findAll({
    //         limit,
    //         order: [
    //             ['createdAt', 'ASC']
    //         ],
    //         attributes: [ 'name', 'description' ]
    //     });
    
    //     res.locals.popularCategories = popularCategories;
    //     next();
    // } catch (error) {
    //     console.log(error);
    //     next();
    // }
    // try {
        // let allNews = await db.news.findAll({
        //     limit,
        //     attributes: [ 'categoryId' ]
        // });

        // let popularCategories = await db.categories.findAll({
        //     limit,
        //     order: [
        //         ['createdAt', 'ASC']
        //     ],
        //     attributes: [ 'name', 'description' ]
        // });

        // let popularCategories = await db.news.findAll({
        //     include: [
        //         {
        //             model: sequelize.model('categories'),
        //             as: 'category',
        //             attributes: [ 'name', 'key', 'description' ]
        //         },
        //     ],
        //     attributes: [Sequelize.fn('COUNT', Sequelize.col('categoryId')), 'categoryId' ],
        //     group: ['category.id']
        // });
        // console.log(popularCategories);

        // const popularCategories = await db.categories.findAll({
        //     include: [
        //         {
        //             model: sequelize.model('news'),
        //             as: 'news',
        //             attributes: [],
        //         },
        //     ],
        //     limit: 5,
        //     attributes: [ 'name', 'key', 'description', [Sequelize.fn('COUNT', Sequelize.col('news.id')), 'newsCount'], ],
        //     group: ['categories.id'], // Assuming 'id' is the primary key of your Category model
        //     order: [[Sequelize.literal('newsCount'), 'ASC']], // Sorting by newsCount in descending order
        // });

        const popularCategories = await db.news.findAll({
            include: [
                {
                    model: sequelize.model('categories'),
                    as: 'category',
                    attributes: ['name', 'key', 'description'],
                },
            ],
            limit: 5,
            attributes: [[Sequelize.fn('COUNT', Sequelize.col('news.categoryId')), 'newsCount'], ],
            group: ['category.id'], // Assuming 'id' is the primary key of your Category model
            order: [[Sequelize.literal('newsCount'), 'DESC']], // Sorting by newsCount in descending order
        });


        // console.log(popularCategories[0].dataValues.count);
        // console.log(popularCategories[0].catsegory.name);
        // console.log(popularCategories[0]);

        // let categoryDetails = await Promise.all(popularCategories.map(async category => {
        //     let categoryInfo = await db.categories.findOne({
        //         // where: { id: categoryCounts.categoryId }, // Match category ID
        //         attributes: ['name', 'description'] // Include additional attributes as needed
        //     });
        //     return categoryInfo;
        // }));

        // console.log(categoryDetails.length);
    
        res.locals.popularCategories = popularCategories;
        next();
    // } catch (error) {
    //     console.log(error);
    //     next();
    // }
}

const getPopularNews = async (req, res, next) => {
    let limit = 3;
    try {
        let popularNews = await db.news.findAll({
            limit,
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: [ 'title', 'key', 'img', 'createdBy' ]
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
            attributes: [ 'title', 'key', 'img', 'createdAt' ]
        });

        res.locals.lastThreeNews = lastThreeNews;
        next();
    } catch (error) {
        console.log(error);
        next();
    }
}

module.exports = { getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals }