const log4js = require('log4js')

log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'file',
            filename: 'log/chat.log',
            level: 'ALL'
        }
    ]
})

module.exports = (author) => log4js.getLogger(author || null)