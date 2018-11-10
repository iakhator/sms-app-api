'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ContactMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contact_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id'
        }
      },
      message_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Messages',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ContactMessages')
  }
}
