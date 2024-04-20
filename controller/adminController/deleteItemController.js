const db = require('../../models/index');
const { successMessages } = require('../../statusMessages/successMessages');
const { errorMessages } = require('../../statusMessages/errorMessages');


const deleteSelectedTag = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasTag = await db.tags.findOne({
            where: {
                id,
            }
        })

        if (hasTag) {
            await db.tags.destroy({
                where: {
                    id,
                }
            })
            res.status(200).json( successMessages.DELETED_TAG );
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_TAG )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const deleteSelectedCategory = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasCategory = await db.categories.findOne({
            where: {
                id,
            }
        })

        if (hasCategory) {
            await db.categories.destroy({
                where: {
                    id,
                }
            })
            res.status(200).json( successMessages.DELETED_CATEGRORY );
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_CATEGORY )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const deletePlatfromSocialMedia = async (req, res, next) => {
    let id = req.query.id;

    try {
        let hasPlatform = await db.platform_medias.findOne({
            where: {
                id,
            }
        })

        if (hasPlatform) {
            await db.platform_medias.destroy({
                where: {
                    id,
                }
            })

            res.status(200).json( successMessages.DELETED_PLATFORM );
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_PLATFORM );
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
    }
}

module.exports = { deleteSelectedTag, deleteSelectedCategory, deletePlatfromSocialMedia }