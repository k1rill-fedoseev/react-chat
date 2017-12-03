//TODO: forwarding messages
//TODO: full api

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./cfg')
const log = require('./log')('main')
const app = express()
const server = require('http').Server(app)
const favicon = require('serve-favicon')
const PORT = process.env.DEV
    ? config.port
    : process.env.PORT
const MONGODB_URI = process.env.DEV
    ? 'mongodb://localhost/chat'
    : process.env.MONGODB_URI

require('./sockets')(server)

server.listen(PORT, () => {
    log.info(`Running server on ${PORT} port`)
})

mongoose.connect(MONGODB_URI, {server: {auto_reconnect: true}})

mongoose.connection
    .on('connected',
        () => log.info('Connected to db'))
    .on('disconnected',
        () => log.warn('Disconnected from db'))
    .on('error',
        err => log.error(`Error with db connection ${err}`)
    )

app.use(favicon(path.join(__dirname, '../build/favicon.ico')))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('../build'))
app.use(express.static('../imagesStore'))