const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');

let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
            .toUpperCase();
    };
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return (
        s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
    );
};

const createNewTag = async (req, res, next) => {
    let inputData = req.body;
    console.log(inputData);

    try {
        await db.tags.create({
            id: guid(),
            name: inputData.name,
            key: inputData.key,
            description: inputData.description,
            status: inputData.status,
        })

        console.log('New Tag was dedected!');
        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla bazaya əlavə olundu!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

const createNewCategory = async (req, res, next) => {
    let inputData = req.body;

    try {
        await db.categories.create({
            id: guid(),
            name: inputData.name,
            key: inputData.key,
            description: inputData.description,
            status: inputData.status,
        })

        console.log('New Category was dedected!');
        res.status(200).json({
            status: 200,
            statusText: "Məlumatlar uğurla bazaya əlavə olundu!",
        });
    } catch (error) {
        // res.status(500).json({
        //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
        //   error,
        // });
        return error;
    }
}

module.exports = { createNewTag, createNewCategory }