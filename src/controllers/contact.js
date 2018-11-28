const Contact = require('../models').Contact
const Message = require('../models').Message
const ContactMessage = require('../models').ContactMessage

module.exports = {
  getAllContact(req, res) {
    return Contact.findAll({
        attributes: ['id', 'contact_name', 'contact_phone'],
        include: [{
          model: Message,
          as: 'messages',
          attributes: [
            'sms', 'sender'
          ],
          through: {
            attributes: ['message_id', 'contact_id']
          }
        }],
        order: [
          ['createdAt', 'DESC']
        ]
      })
      .then((contacts) => res.status(200).send(contacts))
      .catch((error) => {
        res.status(400).send(error)
      })
  },

  createContact(req, res) {
    const {
      contact_name,
      contact_phone
    } = req.body
    if (contact_name === '' && contact_phone === '') {
      return res.status(400).send({
        message: 'Fields must not be empty'
      })
    }

    if (isNaN(contact_phone)) {
      return res.status(400).send({
        message: 'Invalid phone number'
      })
    }

    return Contact
      .create({
        contact_name,
        contact_phone
      })
      .then((contact) => res.status(201).send({
        contact,
        message: 'Contact added successfully'
      }))
      .catch(error => res.status(400).send({
        message: error.errors[0].message || error
      }))
  },

  getOneContact(req, res) {
    const contactId = parseInt(req.params.id)
    if (isNaN(contactId)) {
      return res.status(400).send({
        message: 'Invalid contact id'
      })
    }
    return Contact.findById(contactId, {
        attributes: ['id', 'contact_name', 'contact_phone'],
        include: [{
          model: Message,
          as: 'messages',
          attributes: [
            'sms', 'sender'
          ],
          through: {
            attributes: ['message_id', 'contact_id']
          }
        }],
        order: [
          ['createdAt', 'DESC']
        ]
      })
      .then((contact) => {
        if (!contact) {
          return res.status(404).send({
            message: 'Contact not found'
          })
        }
        return res.status(200).send(contact)
      })
      .catch((error) => res.status(400).send(error))
  },
  updateContact (req, res) {
    const contactId = parseInt(req.params.id)
    if (contactId === 1) {
      return res.status(400).send({
        message: 'You cannot perform that operation'
      })
    }

    if (isNaN(contactId)) {
      return res.status(400).send({
        message: 'Please pass in an integer'
      })
    }
    return Contact
      .findById(contactId)
      .then(contact => {
        if (!contact) {
          return res.status(404).send({
            message: 'Contact not found'
          })
        }
        return contact
          .update({
            contact_name: req.body.contact_name || contact.contact_name,
            contact_phone: req.body.contact_phone || contact.contact_phone
          })
          .then(() => res.status(200).send({
            contact,
            message: 'Contact successfully updated'
          }))
          .catch((error) => res.status(400).send(error))
      })
      .catch((error) => res.status(400).send(error))
  },

  deleteContact (req, res) {
    const contactId = parseInt(req.params.id)
    if (contactId === 1) {
      return res.status(400).send({
        message: 'You cannot perform that operation'
      })
    }

    if (isNaN(contactId)) {
      return res.status(400).send({
        message: 'Invalid contact id'
      })
    }
    ContactMessage.update({
      contact_id: 1
    }, {
      where: {
        contact_id: contactId
      }
    })
    .then(() => {
      return Message.update({
        sender: 1
      }, {
        where: {
          sender: contactId
        }
      })
      .then(() => {
        Contact.findById(contactId)
          .then((contact) => {
            if (!contact) {
              return res.status(404).send({
                message: 'Contact not found'
              })
            }
            return contact
              .destroy()
              .then(() => res.status(200).send({
                message: 'Contact deleted successfully'
              }))
              .catch((error) => res.status(400).send(error))
          })
      })
      .catch((error) => res.status(400).send(error))
    })
    .catch((error) => res.status(400).send(error))
  }
}
