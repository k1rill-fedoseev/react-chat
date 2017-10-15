const log4js = require('log4js')

log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        /*file: {
            type: 'dateFile',
            filename: '../logs/chat.log'
        }*/
    },
    categories: {
        default: {appenders: [/*'file',*/ 'console'], level: 'all'}
    }
})

module.exports = author => log4js.getLogger(author || null)