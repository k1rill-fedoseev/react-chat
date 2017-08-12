const mongoose = require('mongoose'),
    User = require('../models/user'),
    Room = require('../models/room'),
    ObjectId = mongoose.Types.ObjectId

module.exports = {
    idSanitize: (id) =>
        typeof id === 'string' ?
            ObjectId(id) :
            id
    ,

    userSanitize: (user, callback) => {
        if (typeof user === 'string' || user.id)
            User.findById(user,
                (err, user) =>
                    callback(err, user)
            )
        else
            callback(null, user)
    },

    roomSanitize: (room, callback) => {
        if (typeof room === 'string' || room.id)
            Room.findById(room,
                (err, room) =>
                    callback(err, room)
            )
        else
            callback(null, room)
    },

    userRoomSanitize: (user, room, callback) => {
        this.userSanitize(user,
            (err, user) => {
                this.roomSanitize(room,
                    (err1, room) => {
                        if (err || err1)
                            callback(err || err1)
                        else
                            callback(null, user, room)
                    }
                )
            }
        )
    },

    parseMs: (ms) => {
        ms /= 1000
        if (ms < 30)
            return 'now'
        else if (ms < 3600)
            return Math.round(ms / 60) + ' min'
        else if (ms < 86400)
            return Math.round(ms / 3600) + ' hrs'
        else {
            let days = Math.round(ms / 86400)
            if (days === 1)
                return '1 day'
            return days + ' days'
        }
    },

    messagesFilter: (messages) => {
        const result = []

        messages.forEach((cur, i) => {
            result[i] = {}

            result[i].id = cur._id
            result[i].message = cur.message.message

            if (cur.message.from) {
                result[i].from = {
                    name: cur.message.from.name,
                    surname: cur.message.from.surname,
                    photo: cur.message.from.photo
                }
                result[i].me = cur.message.from._id.toString() === cur.owner.toString()
            }
            else {
                result[i].system = true
            }
        })
        return result
    }
}