'use strict';
let bcrypt = require('bcrypt');
let defaultPassword = 'SporterAz1234!';
let hashedPassword = bcrypt.hash(defaultPassword, 10);
let now = new Date();
let guid =  () => {
  let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
          .toUpperCase();
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      id: guid(),
      name: 'Galib',
      surname: 'Mammadli',
      email: 'qalib.mmmdli@gmail.com',
      password: await hashedPassword,
      createdAt: now,
      updatedAt: now,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
