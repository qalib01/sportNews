const db = require('../../models/index');
let jwt = require('jsonwebtoken');
require("dotenv").config();
let bcrypt = require('bcrypt');


const postUserLogin = async (req, res, next) => {
    let inputData = req.body;
    let user = await db.users.findOne({
        where: {
            email: inputData.email,
            status: true,
        },
    });
    if (user) {
        let comparedPassword = await bcrypt.compare(
            inputData.password,
            user.password
        );
        let same = false;
        if (user) {
            same = comparedPassword;
        };
        if (same) {
            var token = createToken(user.id, user.name, user.surname, user.email);
            res.cookie('jwt', token, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                secure: true,
            });
            res.status(200).json({
                status: 200,
                statusText: 'You have logged in successfully. Your page will reload automatically after this message!',
            });
        } else {
            res.status(401).json({
                status: 401,
                statusText: 'Authentication failed. Invalid password, please check your password and try again later!',
            });
        }
    } else {
        res.status(404).json({
            status: 404,
            statusText: 'There was no such this user in our system. Please, check your login informations and try again later. If this problem continues, then contact the IT staff.',
        });
    };
}

const getUserLogout = async (req, res, nect) => {
    res.cookie('jwt', '', {
        maxAge: 1,
    });
    res.redirect('/');
}


const createToken = (id, name, surname, email) => {
    return jwt.sign({ id, name, surname, email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

module.exports = { postUserLogin, getUserLogout }