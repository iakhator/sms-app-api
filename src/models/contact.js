'use strict'
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    contact_name: DataTypes.STRING,
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Phone number already exists'
      },
      validate: {
        notEmpty: true
      }
    }
  }, {})
  Contact.associate = function (models) {
    // associations can be defined here
    Contact.belongsToMany(models.Message, {
      through: 'ContactMessage',
      as: 'messages',
      foreignKey: 'contact_id'
    })
  }
  return Contact
}