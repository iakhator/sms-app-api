import request from 'supertest'
import chai from 'chai'
import app from '../../app'
import db from '../models'

const superRequest = request.agent(app)
const expect = chai.expect

let sender
let reciever

let message1

describe('SMS API', () => {
  before((done) => {
    db.Contact.create({
      contact_name: 'Jack Bauerr',
      contact_phone: '09048474828'
    }).then(jack => {
      sender = jack
      db.Contact.create({
        contact_name: 'John Fring',
        contact_phone: '09028827263'
      }).then(john => {
        reciever = john
        db.Message.create({
          sms: 'blah blah blah',
          sender: sender.id
        }).then((message) => {
          message1 = message
          message.setContacts([sender, reciever])
          done()
        })
      })
    })
  })

  after(done => {
    db.ContactMessage.destroy({
        where: {}
      })
      .then(() => {
        db.Message.destroy({
            where: {}
          })
          .then(() => {
            db.Contact.destroy({
                where: {}
              })
              .then(done())
          })
      })
  })

  describe('CREATE Sms POST /api/sms', () => {
    it('it should send message successfully', (done) => {
      superRequest.post(`/api/sms`)
        .set({
          'content-type': 'application/json'
        })
        .send({
          sender: sender.contact_phone,
          reciever: reciever.contact_phone,
          sms: 'blah blah'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201)
          expect(res.body.message).to.equal('sms sent successfully')
          expect(res.body.data.sms).to.be.equal('blah blah')
          expect(res.body.data.sender).to.be.equal(sender.id)
          done()
        })
    })

    it('it should not send sms when sms field is empty', (done) => {
      superRequest.post(`/api/sms`)
        .set({
          'content-type': 'application/json'
        })
        .send({
          sender: '09045678442',
          reciever: '08067456781',
          sms: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to.equal('Sms field must not be empty')
          done()
        })
    })

    it('it should not send sms when sender field is empty', (done) => {
      superRequest.post(`/api/sms`)
        .set({
          'content-type': 'application/json'
        })
        .send({
          sender: '',
          reciever: '08067456781',
          sms: 'blah blah'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to.equal('Sender Field must not be empty')
          done()
        })
    })

    it('it should not send sms when receiver  and sender numbers are the same', (done) => {
      superRequest.post(`/api/sms`)
        .set({
          'content-type': 'application/json'
        })
        .send({
          sender: '09045678442',
          reciever: '09045678442',
          sms: 'blah blah'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to.equal('sender and reciever\'s phone number must be unique')
          done()
        })
    })
  })

  describe('GET All Sms GET /api/sms', () => {
    it('it should  get all sms for a contact', done => {
      superRequest.get(`/api/sms`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.length).to.be.greaterThan(0)
          done()
        })
    })

    it('it should  get one sms with all contact associated to the sms', done => {
      superRequest.get(`/api/sms/${message1.id}`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.contacts.length).to.be.greaterThan(0)
          done()
        })
    })

    it('it should fail to get all sms for a contact that doesnt exist', done => {
      superRequest.get('/api/sms/89917009')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.message).to.equal('Message not found')
          done()
        })
    })

    it('it should fail to get all sms for invalid sms id successfully', done => {
      superRequest.get('/api/sms/ghcfhvghnf')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to.equal('Invalid message id')
          done()
        })
    })
  })
  describe('UPDATE Sms PUT /api/sms', () => {

    it('it should update sms successfully', (done) => {
      superRequest.put(`/api/sms/${message1.id}`)
        .set({
          'content-type': 'application/json'
        })
        .send({
          sms: 'How are you?'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.message).to.equal('Message successfully updated')
          done()
        })
    })

    it('it should fail to update if messageId does not exist', (done) => {
      superRequest.put(`/api/sms/999999`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.message).to.equal('Message not found')
          done()
        })
    })
  })

  describe('DELETE Sms DELETE /api/sms', () => {

    it('it should delete sms successfully', (done) => {
      superRequest.delete(`/api/sms/${message1.id}`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.message).to.equal('sms deleted successfully')
          done()
        })
    })

    it('it should fail if messageId does not exist', (done) => {
      superRequest.delete(`/api/sms/999999`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.message).to.equal('Message not found')
          done()
        })
    })
  })
})
