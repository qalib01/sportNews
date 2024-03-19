'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('news_views', {
      id: {
        type: Sequelize.STRING,
        autoIncrement: false,
        primaryKey: true,
        allowNull: false,
      },
      newsId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      viewsCounts: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('news_views');
  }
};