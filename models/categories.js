'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      categories.belongsTo(models.news, {
        foreignKey: 'id',
      });
      categories.hasMany(models.sub_categories, {
        foreignKey: 'categoryId',
        sourceKey: 'id',
        as: 'sub_categories',
      });
    };
  };
  categories.init({
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    inOrder: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'categories',
  });
  return categories;
};