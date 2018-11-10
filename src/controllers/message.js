const Contact = require('../models').Contact
const Message = require('../models').Message
const ContactMessage = require('../models').ContactMessage

module.exports = {
  getAllMessages(req, res) {
    return Message.findAll({
        attributes: ['id', 'sms', 'sender'],
        include: [{
          model: Contact,
          as: 'contacts',
          attributes: [
            'contact_name', 'contact_phone'
          ],
          through: {
            attributes: ['message_id', 'contact_id']
          }
        }],
        order: [
          ['createdAt', 'DESC']
        ]
      })
      .then((messages) => res.status(200).send(messages))
      .catch((error) => {
        res.status(400).send(error)
      })
  },

}