var express = require('express');
var router = express.Router();
const { getAllNews, getNewsDetail, getAllCategories } = require('../controller/newsController');
const { getContactPage, getAboutPage, getHomePage } = require('../controller/pageController');
const { getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals } = require('../controller/getMethodsForAllPages');
const { postSubscribes } = require('../controller/postMethods');

router.use(getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals);


/* GET home page. */
router.get('/', getHomePage);

/* GET about page. */
router.get('/about', getAboutPage);

/* GET contact page. */
router.get('/contact', getContactPage);

/* GET news list page. */
router.get('/news', getAllNews);

/* GET news detail page. */
router.get('/news-detail/:key', getNewsDetail);

/* GET category list page. */
router.get('/category-list', getAllCategories);

/* POST Subscribe */
router.post('/subscribe', postSubscribes);

module.exports = router;
