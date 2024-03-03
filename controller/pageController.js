const getHomePage = function (req, res, next) {
    res.render('index', {
        title: 'Home'
    });
}

const getAboutPage = function (req, res, next) {
    res.render('about', {
        title: 'About'
    });
}

const getContactPage = function (req, res, next) {
    res.render('contact', {
        title: 'Contact'
    });
}

module.exports = { getHomePage, getAboutPage, getContactPage }