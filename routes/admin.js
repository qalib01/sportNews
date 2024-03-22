var express = require('express');
const { HomePage, usersPage, newsPage, tagsPage, categoriesPage } = require('../controller/adminController/pageController');
const { createNewTag, createNewCategory } = require('../controller/adminController/postItemController');
const { getSelectedTagData, getSelectedCategoryData } = require('../controller/adminController/getItemController');
const { updateSelectedTag, updateSelectedCategory } = require('../controller/adminController/updateItemController');
const { deleteSelectedTag, deleteSelectedCategory } = require('../controller/adminController/deleteItemController');
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

/* POST new tag. */
router.post('/create-tag', createNewTag);

/* GET selected tag data. */
router.get('/tag', getSelectedTagData);

/* UPDATE selected tag data. */
router.put('/edit-tag', updateSelectedTag);

/* DELETE selected tag data. */
router.delete('/delete-tag', deleteSelectedTag);

/* POST new category. */
router.post('/create-category', createNewCategory);

/* GET selected category data. */
router.get('/category', getSelectedCategoryData);

/* UPDATE selected category data. */
router.put('/edit-category', updateSelectedCategory);

/* DELETE selected category data. */
router.delete('/delete-category', deleteSelectedCategory);


module.exports = router;