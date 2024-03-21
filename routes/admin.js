var express = require('express');
const { HomePage, usersPage, newsPage, tagsPage, categoriesPage } = require('../controller/adminController/pageController');
var router = express.Router();

/* GET dashboard page. */
router.get('/', HomePage);

/* GET users page. */
router.get('/users', usersPage);

/* GET news page. */
router.get('/news', newsPage);

/* GET tags page. */
router.get('/tags', tagsPage);

/* GET categories page. */
router.get('/categories', categoriesPage);


module.exports = router;