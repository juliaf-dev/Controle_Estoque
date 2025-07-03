'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pedidos', 'produto_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'produtos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pedidos', 'produto_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'produtos',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  }
};
