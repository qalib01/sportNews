const checkUserLogin = async(req, res, next) => {
    try {
        const token = await req.cookies.jwt;

        if(!token) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.log('Some error occured when redirect authUser to the Index page!', error);
    }
}

const checkUserLogout = async(req, res, next) => {
    try {
        const token = await req.cookies.jwt;

        if(token) {
            next();
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log('Some error occured when redirect authUser to the Login page!', error);
    }
}

module.exports = { checkUserLogin, checkUserLogout };