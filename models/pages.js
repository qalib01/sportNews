'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pages.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    img_alt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'pages',
  });
  return pages;
};