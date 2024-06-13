const db = require('../../models/index');
let bcrypt = require('bcrypt');
const { successMessages } = require('../../statusMessages/successMessages');
const { errorMessages } = require('../../statusMessages/errorMessages');

let guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
            .toUpperCase();
    };
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
            res.status(200).json( successMessages.ADDED_USER )
        } else {
            res.status(409).json( errorMessages.HAS_ALREADY_USER )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    };

}

const getSelectedUser = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasUser = await db.users.findOne({
            where: {
                id,
            }
        })

        if (hasUser) {
            let data = await db.users.findOne({
                where: {
                    id,
                },
            });

            res.json(data);
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_USER )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR )
    }
}

const updateSelectedUser = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        let hasUser = await db.users.findOne({
            where: {
                id,
            }
        });

        if (hasUser) {
            await db.users.update({
                name: inputData.name,
                surname: inputData.surname,
                status: inputData.status,
            },
            {
                where: {
                    id,
                }
            });

            if (inputData.password.trim() != '') {
                console.log('password', inputData.password);
                await db.users.update({
                    password: await bcrypt.hash(inputData.password, 10),
                },
                {
                    where: {
                        id,
                    }
                });
            }

            res.status(200).json( successMessages.UPDATED_USER )
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_USER )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR )
        console.log(error);
    }
}

const deleteSelectedUser = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasUser = await db.users.findOne({
            where: {
                id
            }
        })

        if (hasUser) {
            if (hasUser.email == res.locals.localUser.email) {
                res.status(403).json( errorMessages.FORBIDDEN_DELETE_SAME_EMAIL )
            } else {
                await db.users.destroy({
                    where: {
                        id,
                    }
                });
                res.status(200).json( successMessages.DELETED_USER )
            }
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_USER )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR )
        console.log(error);
    }
}

module.exports = { createUser, getSelectedUser, updateSelectedUser, deleteSelectedUser }