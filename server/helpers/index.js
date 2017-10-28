const {CheckError} = require('../models/errors')

const checkUnique = function (arr) {
    const exists = {}

    return arr.forEach(elem => {
        if (!exists[elem])
            exists[elem] = true
        else
            throw new CheckError('UserIds should be unique')
    })
}

module.exports = {
    checkUnique
}