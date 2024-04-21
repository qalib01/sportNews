const db = require('../../models/index');
const { errorMessages } = require('../../statusMessages/errorMessages');
const { successMessages } = require('../../statusMessages/successMessages');

const updateSelectedTag = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        let hasTag = await db.tags.findOne({
            where: {
                id,
            }
        });

        let checkNewTag = await db.tags.findOne({
            where: {
                key: inputData.key,
            }
        });

        if (hasTag) {
            if (hasTag.key == inputData.key) {
                await db.tags.update({
                    description: inputData.description,
                    status: inputData.status,
                    updatedBy: res.locals.localUser.id,
                },
                {
                    where: {
                        id,
                    }
                })

                res.status(200).json( successMessages.UPDATED_TAG )
            } else {
                if (checkNewTag) {
                    res.status(409).json( errorMessages.HAS_ALREADY_TAG );
                } else {
                    await db.tags.update({
                        name: inputData.name,
                        key: inputData.key,
                        description: inputData.description,
                        status: inputData.status,
                        updatedBy: res.locals.localUser.id,
                    },
                    {
                        where: {
                            id,
                        }
                    })

                    res.status(200).json( successMessages.UPDATED_TAG )
                }
            }
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_TAG )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const updateSelectedCategory = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        let hasCategory = await db.categories.findOne({
            where: {
                id,
            }
        });

        let checkNewCategory = await db.categories.findOne({
            where: {
                key: inputData.key,
            }
        });

        if (hasCategory) {
            if (hasCategory.key == inputData.key) {
                await db.categories.update({
                    description: inputData.description,
                    inOrder: inputData.inOrder,
                    status: inputData.status,
                    updatedBy: res.locals.localUser.id,
                },
                {
                    where: {
                        id,
                    }
                })

                res.status(200).json( successMessages.UPDATED_CATEGORY )
            } else {
                if (checkNewCategory) {
                    res.status(409).json( errorMessages.HAS_ALREADY_CATEGORY );
                } else {
                    await db.categories.update({
                        name: inputData.name,
                        key: inputData.key,
                        description: inputData.description,
                        inOrder: inputData.inOrder,
                        status: inputData.status,
                        updatedBy: res.locals.localUser.id,
                    },
                    {
                        where: {
                            id,
                        }
                    })

                    res.status(200).json( successMessages.UPDATED_CATEGORY )
                }
            }
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_CATEGORY )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const updateSelectedSubCategory = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        let hasSubCategory = await db.sub_categories.findOne({
            where: {
                id,
            }
        });

        let checkNewSubCategory = await db.sub_categories.findOne({
            where: {
                key: inputData.key,
            }
        });

        if (hasSubCategory) {
            if (hasSubCategory.key == inputData.key) {
                await db.sub_categories.update({
                    description: inputData.description,
                    categoryId: inputData.categoryId,
                    status: inputData.status,
                    updatedBy: res.locals.localUser.id,
                },
                {
                    where: {
                        id,
                    }
                })

                res.status(200).json( successMessages.UPDATED_SUB_CATEGORY )
            } else {
                if (checkNewSubCategory) {
                    res.status(409).json( errorMessages.HAS_ALREADY_SUB_CATEGORY );
                } else {
                    await db.sub_categories.update({
                        name: inputData.name,
                        key: inputData.key,
                        description: inputData.description,
                        categoryId: inputData.categoryId,
                        status: inputData.status,
                        updatedBy: res.locals.localUser.id,
                    },
                    {
                        where: {
                            id,
                        }
                    })

                    res.status(200).json( successMessages.UPDATED_SUB_CATEGORY )
                }
            }
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_SUB_CATEGORY )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

const updatePlatfromSocialMedia = async (req, res, next) => {
    let id = req.query.id;
    let inputData = req.body;

    try {
        let hasPlatform = await db.platform_medias.findOne({
            where: {
                id,
            }
        })

        if (hasPlatform) {
            await db.platform_medias.update({
                name: inputData.name,
                linkSlug: inputData.linkSlug,
                socialMediaId: inputData.socialMediaId,
                status: inputData.status,
                updatedBy: res.locals.localUser.id,
            },
            {
                where: {
                    id,
                }
            });

            res.status(200).json( successMessages.UPDATED_PLATFORM )
        } else {
            res.status(404).json( errorMessages.NOT_FOUND_PLATFORM )
        }
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        console.log(error);
    }
}

module.exports = { updateSelectedTag, updateSelectedCategory, updateSelectedSubCategory, updatePlatfromSocialMedia }