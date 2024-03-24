const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');


const getSelectedTag = async (req, res, next) => {
    let id = req.query.id;
    id = id.replace(':', '');

    try {
        let data = await db.tags.findOne({
            where: {
                id,
            },
        });

        res.json(data);
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

const getSelectedCategory = async (req, res, next) => {
    let id = req.query.id;
    id = id.replace(':', '');

    try {
        let data = await db.categories.findOne({
            where: {
                id,
            },
        });

        res.json(data);
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

const getPlatfromSocialMedia = async (req, res, next) => {
    let id = req.query.id;
    id = id.replace(':', '');

    try {
        let data = await db.platform_medias.findOne({
            where: {
                id,
            },
        });

        res.json(data);
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

module.exports = { getSelectedTag, getSelectedCategory, getPlatfromSocialMedia }