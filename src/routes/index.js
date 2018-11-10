const express = require('express')
const router = express.Router()
const contactController = require('../controllers').contact
const messageController = require('../controllers').message

/* Add contact listing. */
router.post('/contact', contactController.createContact)
router.get('/contact', contactController.getAllContact)
router.get('/contact/:id', contactController.getOneContact)
router.put('/contact/:id', contactController.updateContact)
router.delete('/contact/:id', contactController.deleteContact)

// message api
router.post('/sms', messageController.sendSms) // add/send message
router.get('/sms/:id', messageController.getOneMessage) // get a single message
router.get('/sms', messageController.getAllMessages) // get all messages
router.put('/sms/:id', messageController.updateMessage) // update message
router.delete('/sms/:id', messageController.deleteMessage) // delete message

module.exports = router
