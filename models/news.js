'use strict';
const { Model, sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class news extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      news.hasMany(models.news_tags, {
        foreignKey: 'newsId',
        as: 'news_tags',
      });
      news.hasOne(models.categories, {
        foreignKey: 'id',
        sourceKey: 'categoryId',
        as: 'category',
      });
      news.hasOne(models.sub_categories, {
        foreignKey: 'id',
        sourceKey: 'subCategoryId',
        as: 'sub_category',
      });
      news.hasOne(models.news_views, {
        sourceKey: 'id',
        foreignKey: 'newsId',
        as: 'news_view',
      });
    };
  };
  news.init({
    title: DataTypes.STRING,
    key: DataTypes.STRING,
    img: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    subCategoryId: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    isHeadNews: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    sharedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'news',
  });
  return news;
};