'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class news_tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      news_tags.belongsTo(models.news, {
        foreignKey: 'id',
      });
      news_tags.hasOne(models.tags, {
        foreignKey: 'id',
        sourceKey: 'tagId',
        as: 'tag'
      });
    };
  };
  news_tags.init({
    newsId: DataTypes.STRING,
    tagId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'news_tags',
  });
  return news_tags;
};