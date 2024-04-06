const db = require('../../models/index');
const { sequelize } = require('../../models/index');

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

  if (req.file) {
    img = req.file.filename;
  }
  try {
    await db.news.create({
      id: id,
      title: inputData.title,
      key: inputData.key,
      img,
      categoryId: inputData.categoryId,
      content: inputData.content,
      status: inputData.status,
      sharedAt: inputData.sharedAt,
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
    return error;
  };

}

const getSelectedNews = async (req, res, next) => {
  let id = req.query.id;
  id = id.replace(':', '');

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
    res.json(data);
  } catch (error) {
    // res.status(500).json({
    //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
    //   error,
    // });
    return error;
  }
}

const updateSelectedNews = async (req, res, next) => {
  let id = req.query.id;
  let inputData = req.body;

  try {

    let news = await db.news.findOne({
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

    const beforeTagIds = news.news_tags.map(tag => tag.tagId);
    const afterTagIds = inputData.tags.split(",");
    
    // Find IDs in afterIds that are not in beforeIds
    const addIds = afterTagIds.filter(id => !beforeTagIds.includes(id));
    
    // Find IDs in beforeIds that are not in afterIds
    const removeIds = beforeTagIds.filter(id => !afterTagIds.includes(id));


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
          img: req.file.filename,
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
  } catch (error) {
    // res.status(500).json({
    //   statusText: "Gözlənilməz xəta baş verdi. Xahiş olunur, daha sonra təkrar yoxlayasınız!",
    //   error,
    // });
    console.log(error);
    return error;
  }
}

const deleteSelectedNews = async (req, res, next) => {
  let id = req.query.id;

  try {
    await db.news.destroy({
      where: {
        id,
      }
    })

    await db.news_tags.destroy({
      where: {
        newsId: id,
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

module.exports = { createNews, getSelectedNews, updateSelectedNews, deleteSelectedNews }