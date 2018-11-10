'use strict'
module.exports = (sequelize, DataTypes) => {
  const ContactMessage = sequelize.define('ContactMessage', {
    contact_id: {
      type: DataTypes.INTEGER,
      references: 'Contact',
      referencesKey: 'id',
      allowNull: false
    },
    message_id: {
      type: DataTypes.INTEGER,
      references: 'Message',
      referencesKey: 'id',
      allowNull: false
    }
  }, {})
  ContactMessage.associate = function (models) {
    // associations can be defined here
  }
  return ContactMessage
}