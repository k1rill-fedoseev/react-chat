//TODO: Изменение инфы о комнатах и юзере
//TODO: Удаление сообщений
//TODO: Удаление юзеров из комнаты
//TODO: Удаление чата
//TODO: Is typing...
//TODO: Autoscroll

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./cfg')
const log = require('./log')('main')
const app = express()
const server = require('http').Server(app)

//favicon = require('serve-favicon');

require('./sockets')(server)

server.listen(config.get('port'), () => {
    log.info('Running server on ' + config.get('port') + ' port')
})

mongoose.connect('mongodb://localhost/chat')

mongoose.connection.on('connected', function () {
    log.info('Connected to db')
}).on('disconnected', function () {
    log.warn('Disconnected from db')
}).on('error', function (err) {
    log.error('Error with db connection ' + err)
})

//app.use(favicon('public/favicon.ico'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//app.use(express.static(__dirname + '/public'));