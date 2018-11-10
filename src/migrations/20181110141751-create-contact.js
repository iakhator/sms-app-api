'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contact_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contact_phone: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.bulkInsert('Contacts', [{
        'contact_name': 'Anonymous User',
        'contact_phone': '08057689873',
        'createdAt': new Date(),
        'updatedAt': new Date()
      }])
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contacts')
  }
}
