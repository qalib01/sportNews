'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class platform_medias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      platform_medias.hasOne(models.social_medias, {
        foreignKey: 'id',
        sourceKey: 'socialMediaId',
        as: 'social_media'
      });
    }
  }
  platform_medias.init({
    name: DataTypes.STRING,
    linkSlug: DataTypes.TEXT,
    socialMediaId: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'platform_medias',
  });
  return platform_medias;
};