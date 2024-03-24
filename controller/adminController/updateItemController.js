const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');


const updateSelectedTag = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        await db.tags.update({
            name: inputData.name,
            description: inputData.description,
            status: inputData.status,
        },
            {
                where: {
                    id,
                }
            })

        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla yeniləndi!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

const updateSelectedCategory = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        await db.categories.update({
            name: inputData.name,
            description: inputData.description,
            status: inputData.status,
        },
            {
                where: {
                    id,
                }
            })

        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla yeniləndi!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

const updatePlatfromSocialMedia = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        await db.platform_medias.update({
            name: inputData.name,
            linkSlug: inputData.linkSlug,
            socialMediaId: inputData.socialMediaId,
            status: inputData.status,
        },
            {
                where: {
                    id,
                }
            })

        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla yeniləndi!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

module.exports = { updateSelectedTag, updateSelectedCategory, updatePlatfromSocialMedia }