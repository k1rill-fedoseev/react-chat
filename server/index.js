//TODO: search only not-included users
//TODO: forwarding messages
//TODO: smart online update

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./cfg')
const log = require('./log')('main')
const app = express()
const server = require('http').Server(app)
const favicon = require('serve-favicon');

const mongoUri = 'mongodb://heroku_cmhlhw1n:tr0q96nqjh0lpmh8fvahkck1a0@ds121225.mlab.com:21225/heroku_cmhlhw1n'

require('./sockets')(server)

server.listen(process.env.PORT || config.port, () => {
    log.info(`Running server on ${process.env.PORT || config.port} port`)
})

mongoose.connect(mongoUri/*'mongodb://localhost/chat'*/)

mongoose.connection
    .on('connected',
        () => log.info('Connected to db'))
    .on('disconnected',
        () => log.warn('Disconnected from db'))
    .on('error',
        err => log.error('Error with db connection ' + err)
    )

app.use(favicon(path.join(__dirname, '../build/favicon.ico')));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../build')));