const Contact = require('../models').Contact
const Message = require('../models').Message
const ContactMessage = require('../models').ContactMessage

module.exports = {
  getAllMessages (req, res) {
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

  sendSms (req, res) {
    if (req.body.sender === '') {
      return res.status(400).send({
        message: 'Sender Field must not be empty'
      })
    }
    if (req.body.reciever === '') {
      return res.status(400).send({
        message: 'Reciever Field must not be empty'
      })
    }

    if (req.body.sms === '') {
      return res.status(400).send({
        message: 'Sms field must not be empty'
      })
    }

    if (req.body.sender === req.body.reciever) {
      return res.status(400).send({
        message: 'sender and reciever\'s phone number must be unique'
      })
    }
    return Contact
      .find({
        where: {
          contact_phone: req.body.sender
        }
      })
      .then(sender => {
        if (!sender) {
          res.status(404).send({
            message: 'Sender not Found'
          })
        }
        let users = [sender]
        return Contact
          .find({
            where: {
              contact_phone: req.body.reciever
            }
          }).then(reciever => {
            users.push(reciever)
            return users
          })
      }).then(users => {
        if (!users) {
          return res.status(404).send({
            message: 'Users Not Found'
          })
        }
        return Message.create({
          sms: req.body.sms,
          sender: users[0].id
        })
        .then(message => {
          message.setContacts(users)
          return res.status(201).send({
            data: message,
            message: 'sms sent successfully'
          })
        })
        .catch((error) => res.status(400).send(error))
      })
      .catch((error) => res.status(400).send(error))
  },

  getOneMessage(req, res) {
    const messageId = req.params.id
    if (isNaN(messageId)) {
      return res.status(400).send({
        message: 'Invalid message id'
      })
    }
    return Message.findById(messageId, {
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
      }]
    })
    .then((message) => {
      if (!message) {
        return res.status(404).send({
          message: 'Message not found'
        })
      }
      return res.status(200).send(message)
    })
    .catch((error) => res.status(400).send(error))
  },

  updateMessage (req, res) {
    const messageId = parseInt(req.params.id)
    if (isNaN(messageId)) {
      return res.status(400).send({
        message: 'Please pass in an integer'
      })
    }
    return Message
      .findById(req.params.id)
      .then(message => {
        if (!message) {
          return res.status(404).send({
            message: 'Message not found'
          })
        }
        return message
          .update({
            sms: req.body.sms || message.sms
          })
          .then(() => res.status(200).send({
            message: 'Message successfully updated'
          }))
          .catch((error) => res.status(400).send(error))
      })
      .catch((error) => res.status(400).send(error))
  },

  deleteMessage (req, res) {
    const messageId = parseInt(req.params.id)
    if (isNaN(messageId)) {
      return res.status(400).send({
        message: 'Invalid message id'
      })
    }
    ContactMessage.destroy({
      where: {
        message_id: messageId
      }
    }).then(() => {
      Message.findById(messageId)
        .then(message => {
          if (!message) {
            return res.status(404).send({
              message: 'Message not found'
            })
          }
          return message
            .destroy()
            .then(() => res.status(200).send({
              message: 'sms deleted successfully'
            }))
            .catch((error) => res.status(400).send(error))
        })
        .catch((error) => res.status(400).send(error))
    })
  }
}
