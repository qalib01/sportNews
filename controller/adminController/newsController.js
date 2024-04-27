const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment-timezone');
const fs = require('fs');
const sharp = require('sharp');
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

const createNews = async (req, res, next) => {
  let inputData = req.body;
  let id = guid();
  let img;

  try {
    let hasNews = await db.news.findOne({
      where: {
        key: inputData.key,
      }
    });

    if (hasNews) {
      res.status(409).json( errorMessages.HAS_ALREADY_NEWS );
    } else {
      if(req.file) {
        img = inputData.key + '_' + req.file.filename.split('.').slice(0, -1).join('.') + '.webp';
        let filePath = req.file.path;
        let image = sharp(filePath)
        .webp({ quality: 80 });
        await image.toFile('public/images/news/' + img);
        fs.unlinkSync(filePath);
      }

      await db.news.create({
        id: id,
        title: inputData.title,
        key: inputData.key,
        img,
        categoryId: inputData.categoryId,
        subCategoryId: inputData.subCategoryId,
        content: inputData.content,
        status: inputData.status,
        isHeadNews: inputData.isHeadNews,
        sharedAt: moment(inputData.sharedAt).tz('Asia/Baku'),
        createdBy: res.locals.localUser.id,
      });

      inputData.tags.split(",").forEach(async (tag) => {
        await db.news_tags.create({
          id: guid(),
          newsId: id,
          tagId: tag,
        });
      });

      res.status(200).json( successMessages.ADDED_NEWS );
    }
  } catch (error) {
    res.status(500).json( errorMessages.UNEXPECTED_ERROR );
    console.log(error);
    if (req.file) {
      fs.unlinkSync('public/images/news/' + img);
    }
  };
}

const getSelectedNews = async (req, res, next) => {
  let id = req.query.id;
  try {
    let data = await db.news.findOne({
      where: {
        id,
      },
      include: [
        {
          model: sequelize.model('news_tags'),
          as: 'news_tags',
        }
      ]
    });

    if (data) {
      data = JSON.stringify(data);
      res.send(data);
    } else {
      res.status(404).json( errorMessages.NOT_FOUND_NEWS )
    }
  } catch (error) {
    res.status(500).json( errorMessages.UNEXPECTED_ERROR );
    console.log(error);
  }
}

const updateSelectedNews = async (req, res, next) => {
  let id = req.query.id;
  let inputData = req.body;
  let img;

  try {
    let hasNews = await db.news.findOne({
      include: [
        {
          model: sequelize.model('news_tags'),
          as: 'news_tags',
          attributes: ['tagId'],
        },
      ],
      where: {
        id,
      },
    });

    if (hasNews) {
      const beforeTagIds = hasNews.news_tags.map(tag => tag.tagId);
      const afterTagIds = inputData.tags.split(",");
      const addIds = afterTagIds.filter(id => !beforeTagIds.includes(id));
      const removeIds = beforeTagIds.filter(id => !afterTagIds.includes(id));

      if(req.file) {
        img = hasNews.key + '_' + req.file.filename.split('.').slice(0, -1).join('.') + '.webp';
        let filePath = req.file.path;
        let image = sharp(filePath)
        .webp({ quality: 80 });
        await image.toFile('public/images/news/' + img);
        fs.unlinkSync(filePath);
      }

      await db.news.update({
        title: inputData.title,
        categoryId: inputData.categoryId,
        subCategoryId: inputData.subCategoryId,
        content: inputData.content,
        status: inputData.status,
        isHeadNews: inputData.isHeadNews,
        sharedAt: inputData.sharedAt,
        updatedBy: res.locals.localUser.id,
      },
      {
        where: {
          id,
        }
      })

      if (req.file) {
        fs.unlinkSync('public/images/news/' + hasNews.img);
        
        await db.news.update({
          img,
        },
        {
          where: {
            id,
          }
        })
      }

      if (addIds) {
        addIds.forEach(async (tagId) => {
          await db.news_tags.create({
            id: guid(),
            newsId: id,
            tagId: tagId,
          });
        });
      }
  
      if (removeIds) {
        removeIds.forEach(async (tagId) => {
          await db.news_tags.destroy({
            where: {
              newsId: id,
              tagId,
            }
          });
        });
      }

      res.status(200).json( successMessages.UPDATED_NEWS );
    } else {
      res.status(404).json( errorMessages.NOT_FOUND_NEWS );
    }
  } catch (error) {
    res.status(500).json( errorMessages.UNEXPECTED_ERROR );
    console.log(error);
    if (req.file) {
      fs.unlinkSync('public/images/news/' + img);
    }
  }
}

const getAdminNewsLoadMore = async (req, res, next) => {
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.startIndex) || 0;

  try {
    // Step 1: Calculate total number of news articles
    const totalCount = await db.news.count();

    // Step 2: Determine total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Step 3: Generate array of page numbers
    let visiblePages = [];
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }

    // Step 4: Fetch news articles based on pagination parameters
    let news = await db.news.findAll({
      include: [
        {
          model: sequelize.model('categories'),
          as: 'category',
          attributes: ['name', 'key', 'description', 'status'],
        },
        {
          model: sequelize.model('news_tags'),
          as: 'news_tags',
          include: [
            {
              model: sequelize.model('tags'),
              as: 'tag',
              attributes: ['name', 'key', 'description'],
            },
          ],
        },
      ],
      order: [
        ['createdAt', 'DESC']
      ],
      limit,
      offset,
    });

    res.json({
      news,
      totalPages,
      visiblePages,
    });
  } catch (error) {
    console.error('Error in fetching homepage data:', error);
    next(error);
  }
}

const deleteSelectedNews = async (req, res, next) => {
  let id = req.query.id;

  try {
    let hasNews = await db.news.findOne({
      where: {
        id,
      }
    });

    if (hasNews) {
      await db.news.destroy({
        where: {
          id,
        }
      });
  
      await db.news_tags.destroy({
        where: {
          newsId: id,
        }
      });

      await db.news_views.destroy({
        where: {
          newsId: id,
        }
      })
      // if (hasNews.img !== 'default_image.webp') {
      //   fs.unlinkSync('public/images/news/' + hasNews.img);
      // }

      res.status(200).json( successMessages.DELETED_NEWS );
    } else {
      res.status(404).json( errorMessages.NOT_FOUND_NEWS );
    }
  } catch (error) {
    res.status(500).json( errorMessages.UNEXPECTED_ERROR );
    console.log(error);
  }
}

module.exports = { createNews, getSelectedNews, updateSelectedNews, getAdminNewsLoadMore, deleteSelectedNews }