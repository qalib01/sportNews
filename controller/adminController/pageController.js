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
    res.render('admin/users/users', {
        title: 'Admin Dashboard',
        key: 'users'
    });
}

const newsPage = async (req, res, next) => {
    res.render('admin/news/news', {
        title: 'Xəbərlər',
        key: 'news',
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

const editCategoryPage = async (req, res, next) => {
    res.render('admin/news/category_editor', {
        title: 'Kateqoriyalar',
        key: 'categories',
    });
}


module.exports = { HomePage, usersPage, newsPage, tagsPage, categoriesPage, editCategoryPage }