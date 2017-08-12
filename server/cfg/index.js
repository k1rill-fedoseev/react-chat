const nconf = require('nconf'),
    log = require('../log')('config')

nconf.file('cfg/maincfg.json')

module.exports = {
    get: (field) => nconf.get(field),
    set: (field, value) => {
        nconf.set(field, value)
        nconf.save((err) => err && log.error(err))
    }
}