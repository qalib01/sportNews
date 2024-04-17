const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment-timezone');
const fs = require('fs');
const sharp = require('sharp');


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

  // if (req.file) {
  //   img = req.file.filename;
  // }

  try {
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
      content: inputData.content,
      status: inputData.status,
      sharedAt: inputData.sharedAt,
      createdBy: res.locals.localUser.id,
    });

    inputData.tags.split(",").forEach(async (tag) => {
      await db.news_tags.create({
        id: guid(),
        newsId: id,
        tagId: tag,
      });
    })

    res.status(200).json({
      status: 200,
      statusText: 'Data has been successfully added to the database!',
    });
  } catch (error) {
    console.log(error)
    return error;
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
        content: inputData.content,
        status: inputData.status,
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
    // if (req.file) {
    //   fs.unlinkSync('public/images/news/' + img);
    // }
    console.log(error)
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

      await db.news_views.destroy({
        where: {
          newsId: id,
        }
      })

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

module.exports = { createNews, getSelectedNews, updateSelectedNews, deleteSelectedNews }