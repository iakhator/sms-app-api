
[![Build Status](https://travis-ci.org/iakhator/sms-app-api.svg?branch=master)](https://travis-ci.org/iakhator/sms-app-api)

# SMS API

* SMS provides REST API endpoints for a one on one message sending. It allows create, retrieve, update and delete actions to be carried out.

# API Documentation
The API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API status and errors. Go to [documentation](https://sms-message-api.herokuapp.com/api-docs/)

- use `HTTPS` schemes on heroku
- use `HTTP` schemes on local

## Features

**Contact**:

- The following can be carried out:
  - Create Contact: Contact can be created by passing in the following values to a `POST` request via `/api/contact`.
  
  ``` 
  {
    "contact_name": "John Doe",
    "contact_phone": "09087456734" ,
  }
  ```

  - Retrieve All contacts: Get all contacts by calling a `GET` request via `/api/contact`.
  - Retrieve a contact: Get contact by calling a `GET` request and passing the `contactId` via `/api/contact/:id`.
  - Update contact: User can update contacts by their own Id.
  >`Provide the fields below` then call a `PUT` request via `/api/contact/:id`  the id is the `contact id` you want to update

  ``` 
  {
    "contact_name": "John Doe",
    "contact_phone": "09087456734" ,
  }
  ```

  - Delete Contact: User can delete contact by Id if the Id matches the location id by call calling a `DELETE` request via `/api/contact/:id`.

**Message**:

- The following can be carried out:
  - Create Message: Contact can create message by passing in the following values to a `POST` request via `/api/sms`.
  
  ``` 
  {
    "messsage": "Whats up",
    "sender": "09087456734",
    "reciever": "08074563798"
  }
  ```

  - Retrieve All message: Get all messages with corresponding contacts by calling a `GET` request via `/api/sms`.
  - Retrieve a message: Get a message by calling a `GET` request and passing the `message Id` via `/api/sms/:id`.
  - Update Message: Contact can update message by the message id.
  >`Provide the fields below` then call a `PUT` request via `/api/sms/:id`  the id is the `contact id` you want to update

  ``` 
  {
    "contact_name": "John Doe",
    "contact_phone": "09087456734",
  }
  ```

  - Delete Message: Contact can delete message by Id if the Id matches the message id by call calling a `DELETE` request via `/api/sms/:id`.

## Development
This API is built with the following technologies;

- EcmaScript6 (ES6)
- [NodeJs](https://nodejs.org)
- [Express](http://expressjs.com/)
- [Postgresql](https://www.postgresql.org/)
- [Sequelize ORM](http://docs.sequelizejs.com/en/v3/)

## Installation

- Install [NodeJs](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/) on your machine
- Clone the repository `$ git clone https://github.com/iakhator/sms-app-api.git`
- Change into the directory `$ cd /sms-app-api`
- Install all required dependencies with `$ npm install`
- Create a `.env` file in your root directory as described in `.env.sample` file
- Start the app with `npm start`

## Testing

- Open a terminal and navigate to the project directory 
- Add a test database url (DATABASE_URL) to the .env file.(optional)
- Run `npm test`

## LICENSE
 This project is authored by [Itua Akhator](https://github.com/iakhator) it is licensed under the MIT license.
