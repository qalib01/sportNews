const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const sharp = require('sharp');
const fs = require('fs-extra');
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

const createNews = async (req, res, next) => {
  let inputData = req.body;
  let id = guid();
  let img;

  console.log(inputData.sharedAt);

  // try {
  //   if(req.file) {
  //     img = inputData.key + '.webp';
  //     let imgPath = sharp(req.file.path)
  //     .webp({ quality: 80 });
  //     await imgPath.toFile('public/images/news/' + img);
  //     fs.unlinkSync(req.file.path);
  //   }

  //   await db.news.create({
  //     id: id,
  //     title: inputData.title,
  //     key: inputData.key,
  //     img,
  //     categoryId: inputData.categoryId,
  //     content: inputData.content,
  //     status: inputData.status,
  //     sharedAt: inputData.sharedAt,
  //   });

  //   inputData.tags.split(",").forEach(async (tag) => {
  //     await db.news_tags.create({
  //       id: guid(),
  //       newsId: id,
  //       tagId: tag,
  //     });
  //   })

  //   res.status(200).json({
  //     status: 200,
  //     statusText: 'Data has been successfully added to the database!',
  //   });
  // } catch (error) {
  //   res.status(500).json({
  //     status: 500,
  //     statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
  //   });
  //   if (req.file) {
  //     fs.unlinkSync('public/images/news/' + img);
  //   }
  //   return error;
  // };
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
      ],
    });

    // console.log(data);

    data = JSON.stringify(data);

    res.send(data);
  } catch (error) {
    res.status(500).json({
      status: 500,
      statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
    });
    return error;
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

    const beforeTagIds = hasNews.news_tags.map(tag => tag.tagId);
    const afterTagIds = inputData.tags.split(",");
    
    // Find IDs in afterIds that are not in beforeIds
    const addIds = afterTagIds.filter(id => !beforeTagIds.includes(id));
    
    // Find IDs in beforeIds that are not in afterIds
    const removeIds = beforeTagIds.filter(id => !afterTagIds.includes(id));

    if (hasNews) {
      if(req.file) {
        img = inputData.key + '.webp';
        let imgPath = sharp(req.file.path)
        .webp({ quality: 80 });
        await imgPath.toFile('public/images/news/' + img);
        fs.unlinkSync(req.file.path);
      }

      await db.news.update({
        title: inputData.title,
        categoryId: inputData.categoryId,
        content: inputData.content,
        status: inputData.status,
        sharedAt: inputData.sharedAt,
      },
      {
        where: {
          id,
        }
      })

      if (req.file) {
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
  
      res.status(200).json({
        status: 200,
        statusText: "Məlumatlar uğurla yeniləndi!",
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: "Belə bir xəbər tapılmadı!",
      });
    }
    
  } catch (error) {
    res.status(500).json({
      status: 500,
      statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
    });
    if (req.file) {
      fs.unlinkSync('public/images/news/' + img);
    }
    return error;
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

      fs.unlinkSync('public/images/news/' + hasNews.img);
      
      res.status(200).json({
        status: 200,
        statusText: "Məlumatlar uğurla silindi!",
      });
    } else {
      res.status(404).json({
        status: 404,
        statusText: "Belə bir xəbər tapılmadı!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
    });
    return error;
  }
}

const getAllNews = async (req, res, next) => {
  try {
    let allNews = await db.news.findAll({
      include: [
        {
          model: sequelize.model('categories'),
          as: 'category',
        },
        {
          model: sequelize.model('news_tags'),
          as: 'news_tag',
          include: [
            {
              model: sequelize.model('tags'),
              as: 'tag'
            },
          ],
        },
      ],
    });

    res.send(allNews);
  } catch (error) {
    res.status(500).send({
      status: 500,
      statusText: 'Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!'
    })
    return error;
  }
}

module.exports = { createNews, getSelectedNews, updateSelectedNews, deleteSelectedNews, getAllNews }