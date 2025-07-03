'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('pedidos', 'fornecedor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'fornecedores',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pedidos', 'fornecedor_id');
  }
};
