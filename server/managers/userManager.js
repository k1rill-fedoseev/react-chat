const mongoose = require('mongoose'),
    config = require('../cfg'),
    User = require('../models/user'),
    helpers = require('./helpers'),
    log = require('../log')('PASSWORD')

module.exports = {
    register: (name, surname, username, password, avatar, description, callback) => {
        User.create({
                username,
                password,
                name,
                surname,
                description,
                avatar
            },
            (err, user) => {
                if (err)
                    callback(err)
                else {
                    log.trace(username, password)
                    const token = user.genToken()
                    user.save(() => {
                        callback(null, token, user)
                    })
                }
            })
    },

    auth: (username, password, callback) => {
        User.findOne({username},
            (err, user) => {
                if (err)
                    callback(err)
                else if (!user)
                    callback()
                else {
                    const attempt = user.encrypt(password)

                    if (attempt === user.hashedPassword) {
                        let token = user.genToken()
                        user.save(function (err) {
                            if (err)
                                callback(err)
                            else
                                callback(null, token, user)
                        })
                    }
                    else
                        callback()
                }
            }
        )
    },

    tokenCheck: (token, callback) => {
        if (token) {
            const attempt = User.encrypt(token, config.get('tokenKey'))

            User.findOne({hashedToken: attempt}, callback)
        }
        else
            callback()
    },

    find: (id, callback) => {
        User.findById(id,
            callback
        )
    },

    smartFind: (search, callback) => {
        User.find(
            {
                $text: {$search: search}
            },
            {
                score: {$meta: 'textScore'}
            },
            callback
        ).sort({score: {$meta: 'textScore'}})
    }
}
