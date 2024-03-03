const getAllNews = function (req, res, next) {
    res.render('news', {
        title: 'News',
    });
}

const getNewsDetail = function (req, res, next) {
    res.render('news_detail', {
        title: 'News detail',
    });
}

const getAllCategories = function (req, res, next) {
    res.render('category_list', {
        title: 'Category list'
    });
}

module.exports = { getAllNews, getNewsDetail, getAllCategories }