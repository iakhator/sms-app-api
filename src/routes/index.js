const express = require('express')
const router = express.Router()
const contactController = require('../controllers').contact
// const messageController = require('../controllers').message

/* Add contact listing. */
router.post('/contact', contactController.createContact)
router.get('/contact', contactController.getAllContact)
router.get('/contact/:id', contactController.getOneContact)
// router.put('/api/contact/:id', contactController.updateContact)
// router.delete('/api/contact/:id', contactController.deleteContact)

// message api
// router.post('/api/sms', messageController.sendSms) // add/send message
// router.get('/api/sms/:id', messageController.getOneMessage) // get a single message
// router.get('/api/sms', messageController.getAllMessages) // get all messages
// router.put('/api/sms/:id', messageController.updateMessage) // update message
// router.delete('/api/sms/:id', messageController.deleteMessage) // delete message

module.exports = router
