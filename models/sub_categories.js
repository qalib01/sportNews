'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sub_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      sub_categories.hasOne(models.categories, {
        foreignKey: 'id',
        sourceKey: 'categoryId',
        as: 'category',
      });
      sub_categories.belongsTo(models.news, {
        foreignKey: 'id',
      });
    }
  }
  sub_categories.init({
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    description: DataTypes.TEXT,
    categoryId: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'sub_categories',
  });
  return sub_categories;
};