'use strict';
const bcrypt = require('bcrypt-nodejs');
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Users', [
      // {
      //   email: process.env.ADMIN_EMAIL,
      //   firstName: process.env.ADMIN_FIRST_NAME,
      //   lastName: process.env.ADMIN_LAST_NAME,
      //   password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(8)),
      //   roleId: 1,
      //   createdAt: new Date(),
      //   updatedAt: new Date()
      // },
      {
        email: 'user1@userMail.com',
        firstName: 'user1',
        lastName: 'users',
        password: bcrypt.hashSync('user1 password', bcrypt.genSaltSync(8)),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user2@testMail.com',
        firstName: 'user2',
        lastName: 'users',
        password: bcrypt.hashSync('user2 password', bcrypt.genSaltSync(8)),
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      returning: true
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    queryInterface.bulkDelete('Users', null, {});
  }
};
