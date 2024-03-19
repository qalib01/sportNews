'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class news_views extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      news_views.belongsTo(models.news, {
        foreignKey: 'id',
      });
    }
  }
  news_views.init({
    newsId: DataTypes.STRING,
    viewsCounts: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'news_views',
  });
  return news_views;
};