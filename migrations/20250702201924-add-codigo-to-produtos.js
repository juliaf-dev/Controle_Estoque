'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('produtos', 'codigo', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtos', 'codigo');
  }
};
