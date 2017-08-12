//TODO: Изменение инфы о комнатах и юзере
//TODO: Удаление сообщений
//TODO: Удаление юзеров из комнаты
//TODO: Создание ЛС
//TODO: Подзагрузка сообщений
//TODO: ???Локальное хранилище???
//TODO: Удаление чата
//TODO: Страничка регистрации красивая
//TODO: Онлайн
//TODO: Is typing...
//TODO: Непрочитанные сообщения
//TODO: 3 панель
let express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    config = require('./cfg'),
    log = require('./log')('main'),
    app = express(),
    server = require('http').Server(app),
    userManager = require('./managers/userManager'),
    roomManager = require('./managers/roomManager'),
    messageManager = require('./managers/messageManager'),
    helpers = require('./managers/helpers')

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

app.get('/token', (req, res) => {
    console.log(req.query)
    res.header('Access-Control-Allow-Origin', '*')
    userManager.auth(req.query.username, req.query.password,
        (err, token) => {
            if (err)
                log.error(err)
            else if (token) {
                res.cookie(config.get('cookie:name'), token)
                res.end('<i>1</i>')
            }
            else
                res.end('<i>1</i>')
        })
})