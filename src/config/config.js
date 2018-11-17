require('dotenv').config()

module.exports = {
  development: {
    username: 'smsapp',
    password: 'pass1234',
    database: 'sms_app',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'TEST_DB'
  },
  production: {
    use_env_variable: 'PRODUCTION_DB',
    dialect: 'postgres'
  }
}
