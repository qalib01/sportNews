var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
const { HomePage, usersPage, newsPage, tagsPage, categoriesPage, socialMediasPage, subCategoriesPage } = require('../controller/adminController/pageController');
const { createNewTag, createNewCategory, createPlatfromSocialMedia, createNewSubCategory } = require('../controller/adminController/postItemController');
const { getSelectedTag, getSelectedCategory, getPlatfromSocialMedia, getSelectedSubCategory, getCategorySubCategories } = require('../controller/adminController/getItemController');
const { updateSelectedTag, updateSelectedCategory, updatePlatfromSocialMedia, updateSelectedSubCategory } = require('../controller/adminController/updateItemController');
const { deleteSelectedTag, deleteSelectedCategory, deletePlatfromSocialMedia, deleteSelectedSubCategory } = require('../controller/adminController/deleteItemController');
const { authenticateToken, checkUser } = require('../middleware/authMiddleware');
const { createNews, getSelectedNews, updateSelectedNews, deleteSelectedNews, getAdminNewsLoadMore } = require('../controller/adminController/newsController');
const { createUser, getSelectedUser, updateSelectedUser, deleteSelectedUser } = require('../controller/adminController/usersConroller');


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

/* GET categories page. */
router.get('/sub-categories', [checkUser, authenticateToken], subCategoriesPage);

/* GET social-media page. */
router.get('/social-medias', [checkUser, authenticateToken], socialMediasPage);

/* POST new tag. */
router.post('/create-tag', [checkUser, authenticateToken], createNewTag);

/* GET selected tag data. */
router.get('/selected-tag', [checkUser, authenticateToken], getSelectedTag);

/* UPDATE selected tag data. */
router.put('/edit-tag', [checkUser, authenticateToken], updateSelectedTag);

/* DELETE selected tag data. */
router.delete('/delete-tag', [checkUser, authenticateToken], deleteSelectedTag);

/* POST new category. */
router.post('/create-category', [checkUser, authenticateToken], createNewCategory);

/* GET selected category data. */
router.get('/selected-category', [checkUser, authenticateToken], getSelectedCategory);

/* UPDATE selected category data. */
router.put('/edit-category', [checkUser, authenticateToken], updateSelectedCategory);

/* DELETE selected category data. */
router.delete('/delete-category', [checkUser, authenticateToken], deleteSelectedCategory);

/* POST new category. */
router.post('/create-subCategory', [checkUser, authenticateToken], createNewSubCategory);

/* GET selected category data. */
router.get('/selected-subCategory', [checkUser, authenticateToken], getSelectedSubCategory);

/* UPDATE selected category data. */
router.put('/edit-subCategory', [checkUser, authenticateToken], updateSelectedSubCategory);

/* UPDATE selected category data. */
router.get('/get-subCategories', [checkUser, authenticateToken], getCategorySubCategories);

/* DELETE selected category data. */
router.delete('/delete-subCategory', [checkUser, authenticateToken], deleteSelectedSubCategory);

var img;
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images/news');
    },
    filename: (req, file, callback) => {
        let fileExtension = path.extname(file.originalname).toLowerCase();
        img = Date.now() + fileExtension;
        callback(null, img);
    },
});
var upload = multer({
    storage,
    timeout: 30000,
});

/* POST new news. */
router.post('/create-news', [checkUser, authenticateToken], upload.single('img'), createNews);

/* GET selected news data. */
router.get('/selected-news', [checkUser, authenticateToken], getSelectedNews);

/* UPDATE selected news data. */
router.put('/edit-news', [checkUser, authenticateToken], upload.single('img'), updateSelectedNews);

/* GET load more news data. */
router.get('/news/load-more', [checkUser, authenticateToken], getAdminNewsLoadMore);

/* DELETE selected news data. */
router.delete('/delete-news', [checkUser, authenticateToken], deleteSelectedNews);

/* POST new user. */
router.post('/create-user', [checkUser, authenticateToken], createUser);

/* GET selected user data. */
router.get('/selected-user', [checkUser, authenticateToken], getSelectedUser);

/* UPDATE selected user data. */
router.put('/edit-user', [checkUser, authenticateToken], updateSelectedUser);

/* DELETE selected user data. */
router.delete('/delete-user', [checkUser, authenticateToken], deleteSelectedUser);

/* POST new social_media. */
router.post('/create-social_media', [checkUser, authenticateToken], createPlatfromSocialMedia);

/* GET selected social_media data. */
router.get('/selected-social_media', [checkUser, authenticateToken], getPlatfromSocialMedia);

/* UPDATE selected social_media data. */
router.put('/edit-social_media', [checkUser, authenticateToken], updatePlatfromSocialMedia);

/* DELETE selected social_media data. */
router.delete('/delete-social_media', [checkUser, authenticateToken], deletePlatfromSocialMedia);


module.exports = router;