var express = require('express');
const { HomePage, usersPage, newsPage, tagsPage, categoriesPage } = require('../controller/adminController/pageController');
const { createNewTag, createNewCategory } = require('../controller/adminController/postItemController');
const { getSelectedTagData, getSelectedCategoryData } = require('../controller/adminController/getItemController');
const { updateSelectedTag, updateSelectedCategory } = require('../controller/adminController/updateItemController');
const { deleteSelectedTag, deleteSelectedCategory } = require('../controller/adminController/deleteItemController');
const { authenticateToken, checkUser } = require('../middleware/authMiddleware');
var router = express.Router();

/* GET dashboard page. */
router.get('/', [checkUser, authenticateToken], HomePage);

/* GET users page. */
router.get('/users', [checkUser, authenticateToken], usersPage);

/* GET news page. */
router.get('/news', [checkUser, authenticateToken], newsPage);

/* GET tags page. */
router.get('/tags', [checkUser, authenticateToken], tagsPage);

/* GET categories page. */
router.get('/categories', [checkUser, authenticateToken], categoriesPage);

/* POST new tag. */
router.post('/create-tag', [checkUser, authenticateToken], createNewTag);

/* GET selected tag data. */
router.get('/tag', [checkUser, authenticateToken], getSelectedTagData);

/* UPDATE selected tag data. */
router.put('/edit-tag', [checkUser, authenticateToken], updateSelectedTag);

/* DELETE selected tag data. */
router.delete('/delete-tag', [checkUser, authenticateToken], deleteSelectedTag);

/* POST new category. */
router.post('/create-category', [checkUser, authenticateToken], createNewCategory);

/* GET selected category data. */
router.get('/category', [checkUser, authenticateToken], getSelectedCategoryData);

/* UPDATE selected category data. */
router.put('/edit-category', [checkUser, authenticateToken], updateSelectedCategory);

/* DELETE selected category data. */
router.delete('/delete-category', [checkUser, authenticateToken], deleteSelectedCategory);

/* POST new news. */
router.post('/create-news', [checkUser, authenticateToken], createNewCategory);

/* GET selected news data. */
router.get('/news', [checkUser, authenticateToken], getSelectedCategoryData);

/* UPDATE selected news data. */
router.put('/edit-news', [checkUser, authenticateToken], updateSelectedCategory);

/* DELETE selected news data. */
router.delete('/delete-news', [checkUser, authenticateToken], deleteSelectedCategory);


module.exports = router;