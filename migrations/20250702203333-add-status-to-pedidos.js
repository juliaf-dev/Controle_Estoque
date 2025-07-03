'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pedidos', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'a-caminho',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pedidos', 'status');
  }
};
