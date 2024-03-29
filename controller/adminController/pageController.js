const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');
// moment.locale('az');


const HomePage = async (req, res, next) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        key: 'home',
    });
}

const usersPage = async (req, res, next) => {
    let users = await db.users.findAll({
        order: [
            ['createdAt', 'ASC']
        ]
    });
    res.render('admin/users/users', {
        title: 'İstifadəçilər',
        key: 'users',
        users,
    });
}

const newsPage = async (req, res, next) => {
    let news = await db.news.findAll({
        include: [
            {
                model: sequelize.model('categories'),
                as: 'category',
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
                        where: {
                            status: true
                        }
                    },
                ],
            },
            {
                model: sequelize.model('news_views'),
                as: 'news_view',
                attributes: ['viewsCounts']
            },
        ],
        order: [
            ['createdAt', 'DESC']
        ],
        // attributes: ['title', 'key', 'img', 'createdBy', 'createdAt']
    });
    let tags = await db.tags.findAll({
        where: {
            status: true,
        },
        order: [
            ['createdAt', 'ASC']
        ]
    });
    let categories = await db.categories.findAll({
        where: {
            status: true,
        },
        order: [
            ['createdAt', 'ASC']
        ]
    });
    res.render('admin/news/news', {
        title: 'Xəbərlər',
        key: 'news',
        tags,
        news,
        categories,
    });
}

const tagsPage = async (req, res, next) => {
    let tags = await db.tags.findAll({
        order: [
            ['createdAt', 'ASC']
        ]
    });
    res.render('admin/news/tags', {
        title: 'Taglar',
        key: 'tags',
        tags,
    });
}

const categoriesPage = async (req, res, next) => {
    let categories = await db.categories.findAll({
        order: [
            ['createdAt', 'ASC']
        ]
    });
    res.render('admin/news/categories', {
        title: 'Kateqoriyalar',
        key: 'categories',
        categories,
    });
}

const socialMediasPage = async (req, res, next) => {
    let socialMedias = await db.social_medias.findAll();
    let platformMedias = await db.platform_medias.findAll({
        include: [
            {
                model: sequelize.model('social_medias'),
                as: 'social_media',
            }
        ]
    });
    res.render('admin/items/social_medias', {
        title: 'Sosial medialar',
        key: 'socialMedias',
        socialMedias,
        platformMedias,
    });
}

module.exports = { HomePage, usersPage, newsPage, tagsPage, categoriesPage, socialMediasPage }