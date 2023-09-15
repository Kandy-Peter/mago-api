'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('forex_bureaus', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      bureau_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      bureau_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      bureau_phone_number: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true,
      },
      forex_avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "https://res.cloudinary.com/dollarmarket/image/upload/v1694708974/mago/money_dhei7j.png",
      },
      is_forex_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_forex_account_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      locations: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        defaultValue: [],
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('forex_bureaus');
  }
};
