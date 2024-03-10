const db = require('../models/index');
const { sequelize } = require('../models/index');
const { Op } = require('sequelize');

const getAllNews = async (req, res, next) => {
    let queryOptions = {
        include: [],
        where: {
            status: true,
        },
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: ['title', 'key', 'img', 'content', 'createdBy', 'createdAt']
    };

    // Conditionally include category filtering if req.query.category is provided
    if (req.query.category) {
        queryOptions.include.push({
            model: sequelize.model('categories'),
            as: 'category',
            where: { 
                key: req.query.category, // Filter tags by key
                status: true,
            }, 
            attributes: ['name', 'key', 'description']
        });
    
        queryOptions.where = {
            '$news.categoryId$': { [Op.ne]: null } // Ensure there's a category associated
        };
    }
    
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
                    }
                },
            ],
            where: {
                status: true,
            },
            attributes: ''
        });
    
        queryOptions.where = {
            '$news_tags.tagId$': { [Op.ne]: null }, // Ensure there's a tag associated
        };
    }

    let allNews = await db.news.findAll(queryOptions);
    let allTags = await db.tags.findAll({
        order: [
            ['createdAt', 'ASC']
        ],
        attributes: [ 'name', 'key' ]
    });
    res.render('news', {
        title: 'Xəbərlər',
        name: 'Xəbərlər',
        key: 'news',
        allNews,
        allTags
    });
}

const getNewsDetail = async (req, res, next) => {
    let key = req.params.key;
    let selectedNews = await db.news.findOne({
        include: [
            {
                model: sequelize.model('news_tags'),
                as: 'news_tags',
                include: [
                    {
                        model: sequelize.model('tags'),
                        as: 'tag',
                        attributes: [ 'name', 'key', 'description' ]
                    },
                ],
                attributes: ''
            },
            {
                model: sequelize.model('categories'),
                as: 'category',
                attributes: [ 'name', 'key', 'description' ]
            },
        ],
        attributes: [ 'title', 'key', 'img', 'content', 'createdBy' ],
        where: {
            key,
            // status: true
        },
    });
    console.log(key);
    res.render('news_detail', {
        title: selectedNews.title,
        name: selectedNews.title,
        key: 'news',
        selectedNews,
    });
}

const getAllCategories = function (req, res, next) {
    res.render('category_list', {
        title: 'Category list'
    });
}

module.exports = { getAllNews, getNewsDetail, getAllCategories }