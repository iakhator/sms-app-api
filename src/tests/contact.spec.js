import request from 'supertest'
import chai from 'chai'
import app from '../../app'
import db from '../models'

const superRequest = request.agent(app)
const expect = chai.expect

let testContact

describe('Contact Api', () => {
  before(done => {
    db.Contact.create({
      contact_name: 'John Doe',
      contact_phone: '09087675436'
    })
    .then((contact) => {
      testContact = contact.dataValues
      done()
    })
  })

  after(done => {
    db.Contact.destroy({
      where: {}
    })
    .then(done())
  })

  describe('CREATE Contact POST /api/contact', () => {
    it('it should create a new contact when data is valid', done => {
      superRequest.post('/api/contact')
        .set({
          'content-type': 'application/json'
        })
        .send({
          contact_name: 'John Kent',
          contact_phone: '04063009409'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201)
          expect(res.body.message).to
            .equal('Contact added successfully')
          expect(res.body.contact.contact_name).to.equal('John Kent')
          expect(res.body.contact.contact_phone).to.equal('04063009409')
          done()
        })
    })

    it('it should not create a contact with no contact name or contact phone number', done => {
      superRequest.post('/api/contact')
        .set({
          'content-type': 'application/json'
        })
        .send({
          contact_name: '',
          contact_phone: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to
            .equal('Fields must not be empty')
          done()
        })
    })

    it('it should not create a contact with the same phone number', done => {
      superRequest.post('/api/contact')
        .set({
          'content-type': 'application/json'
        })
        .send({
          contact_name: 'Daniel Fed',
          contact_phone: testContact.contact_phone
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to
            .equal('Phone number already exists')
          done()
        })
    })

    it('it should not create a phoneNumber with invalid type', (done) => {
      superRequest.post('/api/contact')
        .set({
          'content-type': 'application/json'
        })
        .send({
          contact_name: 'Invalid User',
          contact_phone: 'sasadas'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to
            .equal('Invalid phone number')
          done()
        })
    })
  })

  describe('GET Contact GET /api/contact/id', () => {
    it('it should get a contact when it exists', done => {
      superRequest.get(`/api/contact/${testContact.id}`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(testContact.contact_name).to.equal('John Doe')
          expect(testContact.contact_phone).to.equal('09087675436')
          done()
        })
    })

    it('it should not get a contact if it does not exist', done => {
      superRequest.get('/api/contact/99999999999')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.message).to.equal('Contact not found')
          done()
        })
    })

    it('it should not get a contact if contactId is invalid', done => {
      superRequest.get('/api/contact/hghjg')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to.equal('Invalid contact id')
          done()
        })
    })
  })

  describe('GET all Contacts GET /api/contact', () => {
    it('it should get all contacts successfully', (done) => {
      superRequest.get('/api/contact')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.length).to.be.greaterThan(0)
          done()
        })
    })
  })

  describe('UPDATE Contact PUT /api/contact', () => {
    it('it should update a single contact', done => {
      superRequest.put(`/api/contact/${testContact.id}`)
        .set({
          'content-type': 'application/json'
        })
        .send({
          contact_name: 'Test Updating',
          contact_phone: '01234567980'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.contact.contact_name).to.equal('Test Updating')
          expect(res.body.contact.contact_phone).to.equal('01234567980')
          done()
        })
    })

    it('it should fail for a contact that doesn\'t exist', done => {
      superRequest.put('/api/contact/10000000')
        .set({
          'content-type': 'application/json'
        })
        .send({
          contact_name: 'testing',
          contact_phone: '01234567982'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.message).to.equal('Contact not found')
          done()
        })
    })
  })

  describe('DELETE Contact DELETE /api/contact', () => {

    it('it should delete a contact successfully', done => {
      superRequest.delete(`/api/contact/${testContact.id}`)
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.message).to.equal('Contact deleted successfully')
          done()
        })
    })

    it('it should fail for Invalid contact', done => {
      superRequest.delete('/api/contact/ssdhnaf')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.body.message).to
            .equal('Invalid contact id')
          done()
        })
    })

    it('it should fail if contact is not found', done => {
      superRequest.delete('/api/contact/1291021902')
        .set({
          'content-type': 'application/json'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404)
          expect(res.body.message).to
            .equal('Contact not found')
          done()
        })
    })
  })
})
