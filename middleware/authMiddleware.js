const { sequelize } = require("../models/index.js");
let db = require("../models/index.js");
require('dotenv').config();
let jwt = require("jsonwebtoken");


const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log('ERROR!', err.message);
        res.locals.localUser = null;
      } else {
        const localUser = await db.users.findOne({
          where: {
            id: decodedToken.id,
            status: true,
          },
        });

        if(localUser) {
          res.locals.localUser = localUser;
        } else {
          res.cookie('jwt', '', {
            maxAge: 1,
          });
        }
        next();
      }
    });
  } else {
    res.locals.localUser = null;
    next();
  };
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
          console.log(err.message);
          next();
        } else {
          next();
        }
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    res.redirect("/");
  };
};

module.exports = { authenticateToken, checkUser };