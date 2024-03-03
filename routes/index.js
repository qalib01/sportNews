var express = require('express');
const { getAllNews, getNewsDetail, getAllCategories } = require('../controller/newsController');
const { getContactPage, getAboutPage, getHomePage } = require('../controller/pageController');
var router = express.Router();

/* GET home page. */
router.get('/', getHomePage);

/* GET about page. */
router.get('/about', getAboutPage);

/* GET contact page. */
router.get('/contact', getContactPage);

/* GET news list page. */
router.get('/news', getAllNews);

/* GET news detail page. */
router.get('/news-detail', getNewsDetail);

/* GET category list page. */
router.get('/category-list', getAllCategories);

module.exports = router;
