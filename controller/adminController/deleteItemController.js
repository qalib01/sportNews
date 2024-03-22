const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');

const deleteSelectedTag = async (req, res, next) => {
    let id = req.query.id;

    try {
        await db.tags.destroy({
            where: {
                id,
            }
        })

        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla silindi!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

const deleteSelectedCategory = async (req, res, next) => {
    let id = req.query.id;

    try {
        await db.categories.destroy({
            where: {
                id,
            }
        })

        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla silindi!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}
module.exports = { deleteSelectedTag, deleteSelectedCategory }