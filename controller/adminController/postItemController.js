const db = require('../../models/index');
const { errorMessages } = require('../../statusMessages/errorMessages');
const { successMessages } = require('../../statusMessages/successMessages');

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

const createNewTag = async (req, res, next) => {
    let inputData = req.body;

    try {
        let hasTag = await db.tags.findOne({
            where: {
                key: inputData.key,
            }
        });

        if (hasTag) {
            res.status(409).json( errorMessages.HAS_ALREADY_TAG )
        } else {
            await db.tags.create({
                id: guid(),
                name: inputData.name,
                key: inputData.key,
                description: inputData.description,
                status: inputData.status,
                createdBy: res.locals.localUser.id,
            })
    
            res.status(200).json( successMessages.ADDED_TAG );
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR )
    }
}

const createNewCategory = async (req, res, next) => {
    let inputData = req.body;

    try {
        let hasCategory = await db.categories.findOne({
            where: {
                key: inputData.key,
            }
        })

        if (hasCategory) {
            res.status(409).json( errorMessages.HAS_ALREADY_CATEGORY )
        } else {
            await db.categories.create({
                id: guid(),
                name: inputData.name,
                key: inputData.key,
                inOrder: inputData.inOrder,
                description: inputData.description,
                status: inputData.status,
                createdBy: res.locals.localUser.id,
            })

            res.status(200).json( successMessages.ADDED_CATEGRORY )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const createNewSubCategory = async (req, res, next) => {
    let inputData = req.body;

    try {
        let hasSubCategory = await db.sub_categories.findOne({
            where: {
                key: inputData.key,
            }
        })

        if (hasSubCategory) {
            res.status(409).json( errorMessages.HAS_ALREADY_SUB_CATEGORY )
        } else {
            await db.sub_categories.create({
                id: guid(),
                name: inputData.name,
                key: inputData.key,
                description: inputData.description,
                categoryId: inputData.categoryId,
                status: inputData.status,
                createdBy: res.locals.localUser.id,
            })

            res.status(200).json( successMessages.ADDED_SUB_CATEGRORY )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const createPlatfromSocialMedia = async (req, res, next) => {
    let inputData = req.body;

    try {
        let hasPlatform = await db.platform_medias.findOne({
            where: {
                name: inputData.name,
                linkSlug: inputData.linkSlug,
                socialMediaId: inputData.socialMediaId
            }
        })

        if (hasPlatform) {
            res.status(409).json( errorMessages.HAS_ALREADY_PLATFORM )
        } else {
            await db.platform_medias.create({
                id: guid(),
                name: inputData.name,
                linkSlug: inputData.linkSlug,
                socialMediaId: inputData.socialMediaId,
                status: inputData.status,
                createdBy: res.locals.localUser.id,
            })
    
            res.status(200).json( successMessages.ADDED_PLATFORM );
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

module.exports = { createNewTag, createNewCategory, createNewSubCategory, createPlatfromSocialMedia }