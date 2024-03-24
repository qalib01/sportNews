'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class social_medias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      social_medias.belongsTo(models.platform_medias, {
        foreignKey: 'id',
      });
    }
  }
  social_medias.init({
    icon: DataTypes.STRING,
    name: DataTypes.STRING,
    type: DataTypes.BOOLEAN,
    link: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'social_medias',
  });
  return social_medias;
};