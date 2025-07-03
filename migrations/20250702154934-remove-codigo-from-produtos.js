'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtos', 'codigo');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('produtos', 'codigo', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
