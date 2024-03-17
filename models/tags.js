'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tags.belongsTo(models.news_tags, {
        foreignKey: 'id',
      });
    }
  }
  tags.init({
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'tags',
  });
  return tags;
};