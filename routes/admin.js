var express = require('express');
const { HomePage } = require('../controller/adminController/pageController');
var router = express.Router();

/* GET dashboard page. */
router.get('/', HomePage);

/* GET users page. */
router.get('/users', HomePage);

/* GET news page. */
router.get('/news', HomePage);

/* GET tags page. */
router.get('/tags', HomePage);

/* GET categories page. */
router.get('/categories', HomePage);


module.exports = router;