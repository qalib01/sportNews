const db = require('../models/index');
const { sequelize } = require('../models/index');

const getHomePage = async (req, res, next) => {
    let limit = 6;
    let lastNews = await db.news.findAll({
        limit,
        order: [
            ['createdAt', 'DESC']
        ],
        attributes: [ 'title', 'key', 'img', 'createdBy', 'createdAt' ]
    });
    let allTags = await db.tags.findAll({
        order: [
            ['createdAt', 'ASC']
        ],
        attributes: [ 'name', 'key' ]
    });
    res.render('index', {
        title: 'Ana səhifə',
        name: 'Ana səhifə',
        key: 'home',
        lastNews,
        allTags,
    });
}

const getAboutPage = function (req, res, next) {
    res.render('about', {
        title: 'Haqqımızda',
        name: 'Haqqımızda',
        key: 'about',
    });
}

const getContactPage = function (req, res, next) {
    res.render('contact', {
        title: 'Əlaqə',
        name: 'Əlaqə',
        key: 'contact',
    });
}

module.exports = { getHomePage, getAboutPage, getContactPage }