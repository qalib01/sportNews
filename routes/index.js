var express = require('express');
var router = express.Router();
const { getAllNews, getNewsDetail, getAllCategories } = require('../controller/indexController/newsController');
const { getAboutPage, getHomePage, getLoginPage } = require('../controller/indexController/pageController');
const { getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals } = require('../controller/indexController/getMethodsForAllPages');
const { postSubscribes } = require('../controller/indexController/postMethods');
const { checkUserLogin } = require('../middleware/checkToken');
const { postUserLogin } = require('../controller/indexController/userController');

router.use(getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals);


/* GET home page. */
router.get('/', getHomePage);

/* GET about page. */
router.get('/about', getAboutPage);

/* GET news list page. */
router.get('/news', getAllNews);

/* GET news detail page. */
router.get('/news-detail/:key', getNewsDetail);

/* GET category list page. */
router.get('/category-list', getAllCategories);

/* POST subscribe */
router.post('/subscribe', postSubscribes);

/* POST login */
router.post('/login', [checkUserLogin], postUserLogin);

/* GET login */
router.get('/login', [checkUserLogin], getLoginPage);


module.exports = router;
