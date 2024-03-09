const db = require('../models/index');
const { sequelize } = require('../models/index');
const successMessages = require('../statusMessages/successMessages.json');
const errorMessages = require('../statusMessages/errorMessages.json');

const postSubscribes = async (req, res, next) => {
    let inputData = req.body;
    let email = inputData.email;

    let hasEmail = await db.subscribes.findOne({
        where: {
            email,
        },
    });
    try {
        if (hasEmail) {
            res.status(409).json(errorMessages.EMAIL_ALREADY_HAS);
        } else {
            await db.subscribes.create({
                email,
            }).then(() => {
                res.status(200).json(successMessages.SUBSCRIPTION_DONE);
            });
            console.log('New subsrciber:', email);
        }
    } catch (error) {
        res.status(500).json(errorMessages.UNEXPECTED_ERROR);
    }
}

module.exports = { postSubscribes };