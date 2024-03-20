const HomePage = async (req, res, next) => {
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
    });
}

module.exports = { HomePage }