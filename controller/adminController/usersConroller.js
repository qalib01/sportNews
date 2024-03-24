const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment');
let bcrypt = require('bcrypt');



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

const createUser = async (req, res, next) => {
    let inputData = req.body;
    let id = guid();

    try {

        let isUser = await db.users.findOne({
            where: {
                email: inputData.email,
            }
        })

        if (!isUser || isUser.length == 0 || isUser == null) {
            await db.users.create({
                id: id,
                name: inputData.name,
                surname: inputData.surname,
                email: inputData.email,
                password: await bcrypt.hash(inputData.password, 10),
                status: inputData.status,
            });
            res.status(200).json({
                status: 200,
                statusText: 'Data has been successfully added to the database!',
            });
        }

        res.status(409).json({
            status: 409,
            statusText: 'Data has already in the database!',
        });
    } catch (error) {
        return error;
    };

}

const getSelectedUser = async (req, res, next) => {
    let id = req.query.id;
    id = id.replace(':', '');

    try {
        let data = await db.users.findOne({
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

const updateSelectedUser = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        await db.users.update({
            name: inputData.name,
            surname: inputData.surname,
            email: inputData.email,
            password: await bcrypt.hash(inputData.password, 10),
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

const deleteSelectedUser = async (req, res, next) => {
    let id = req.query.id;

    try {
        await db.users.destroy({
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

module.exports = { createUser, getSelectedUser, updateSelectedUser, deleteSelectedUser }