const db = require('../models/index');
const { sequelize } = require('../models/index');

const getAllNews = async (req, res, next) => {
    let allNews = await db.news.findAll({
        include: [
            {
                model: sequelize.model('news_tags'),
                as: 'news_tags',
                include: [
                    {
                        model: sequelize.model('tags'),
                        as: 'tag',
                        attributes: [ 'name', 'description' ]
                    },
                ],
                attributes: ''
            },
            {
                model: sequelize.model('categories'),
                as: 'category',
                attributes: [ 'name', 'description' ]
            },
        ],
        attributes: [ 'title', 'key', 'img', 'content', 'createdBy' ]
    });
    res.render('news', {
        title: 'News',
        allNews
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
                        attributes: [ 'name', 'description' ]
                    },
                ],
                attributes: ''
            },
            {
                model: sequelize.model('categories'),
                as: 'category',
                attributes: [ 'name', 'description' ]
            },
        ],
        attributes: [ 'title', 'key', 'img', 'content', 'createdBy' ],
        where: {
            key,
        },
    });
    console.log(selectedNews.category.name);
    res.render('news_detail', {
        title: 'News detail',
        selectedNews,
    });
}

const getAllCategories = function (req, res, next) {
    res.render('category_list', {
        title: 'Category list'
    });
}

module.exports = { getAllNews, getNewsDetail, getAllCategories }