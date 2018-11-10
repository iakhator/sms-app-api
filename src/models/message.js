'use strict'
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sms: DataTypes.STRING,
    sender: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'sent'
    }
  }, {})
  Message.associate = function (models) {
    // associations can be defined here
    Message.belongsToMany(models.Contact, {
      through: 'ContactMessage',
      as: 'contacts',
      foreignKey: 'message_id'
    })
  }
  return Message
}