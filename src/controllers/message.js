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

  sendSms(req, res) {
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

}