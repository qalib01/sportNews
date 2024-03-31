var express = require('express');
var router = express.Router();
const { getAllNews, getNewsDetail, getNewsLoadMore } = require('../controller/indexController/newsController');
const { getAboutPage, getHomePage, getLoginPage } = require('../controller/indexController/pageController');
const { getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals, getPlatformSocialMedias, getPageMetaContents } = require('../controller/indexController/getMethodsForAllPages');
const { postSubscribes } = require('../controller/indexController/postMethods');
const { checkUserLogin, checkUserLogout } = require('../middleware/checkToken');
const { postUserLogin, getUserLogout } = require('../controller/indexController/userController');

router.use(getPopularCategories, getPopularNews, getLastThreeNews, setMomentToLocals, getPlatformSocialMedias);

/* GET home page. */
router.get('/', getHomePage);

/* GET about page. */
router.get('/about', getAboutPage);

/* GET news list page. */
router.get('/news', getAllNews);

/* GET news. */
// router.get('/news/news-loadmore', getNewsLoadMore);

/* GET news detail page. */
router.get('/news/news-detail', getNewsDetail);

/* POST subscribe. */
router.post('/subscribe', postSubscribes);

/* POST login. */
router.post('/login', [checkUserLogin], postUserLogin);

/* GET login page. */
router.get('/login', [checkUserLogin], getLoginPage);

/* GET logout. */
router.get('/logout', [checkUserLogout], getUserLogout);

module.exports = router;