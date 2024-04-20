const db = require('../../models/index');
const { errorMessages } = require('../../statusMessages/errorMessages');

const getSelectedTag = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasTag = await db.tags.findOne({
            where: {
                id,
            },
        });

        if (hasTag) {
            res.json(hasTag);
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_TAG )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error)
    }
}

const getSelectedCategory = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasCategory = await db.categories.findOne({
            where: {
                id,
            },
        });

        if (hasCategory) {
            res.json(hasCategory);
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_CATEGORY )
        }

    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR )
        console.log(error);
    }
}

const getPlatfromSocialMedia = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasPlatform = await db.platform_medias.findOne({
            where: {
                id,
            },
        });

        console.log(hasPlatform);

        if (hasPlatform) {
            res.json(hasPlatform);
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_PLATFORM )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
    }
}

module.exports = { getSelectedTag, getSelectedCategory, getPlatfromSocialMedia }