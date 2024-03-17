'use strict';
const { Model } = require('sequelize');

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
        as: 'news_tags'
      });
      news.hasOne(models.categories, {
        foreignKey: 'id',
        sourceKey: 'categoryId',
        as: 'category'
      });
    };
  };
  news.init({
    title: DataTypes.STRING,
    key: DataTypes.STRING,
    img: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'news',
  });
  return news;
};