const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const logger = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const indexRouter = require('./src/routes/index')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/api', indexRouter)
app.get('/', function (req, res) {
  res.render('index', {
    title: 'Hey',
    message: 'Hello there!'
  })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
