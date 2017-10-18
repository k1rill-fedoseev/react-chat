const log4js = require('log4js')

if (process.env.DEV)
    log4js.configure({
        appenders: {
            console: {
                type: 'console'
            },
            file: {
             type: 'dateFile',
             filename: '../logs/chat.log'
             }
        },
        categories: {
            default: {appenders: ['file', 'console'], level: 'all'}
        }
    })
else
    log4js.configure({
        appenders: {
            console: {
                type: 'console'
            }
        },
        categories: {
            default: {appenders: ['console'], level: 'all'}
        }
    })

module.exports = author => log4js.getLogger(author || null)