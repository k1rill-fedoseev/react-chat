const Room = require('../models/room'),
    User = require('../models/user'),
    messageManager = require('./messageManager'),
    helpers = require('./helpers')

module.exports = {
    create: (creator, options, callback) => {
        Room.create({
                isRoom: options.isRoom,
                name: options.name || undefined,
                description: options.description || undefined,
                creator: creator,
                users: [creator],
                avatar: options.avatar || undefined
            },
            callback
        )
    },

    isMember: (user, room, callback) => {
        const userId = user._id || helpers.idSanitize(user)

        helpers.roomSanitize(room,
            (err, room) => {
                if (err)
                    callback(err)
                else
                    callback(null, room.users.indexOf(userId) !== -1)
            }
        )
    },

    addUsers: (users, room, callback) => {
        helpers.roomSanitize(room,
            (err, room) => {
                let done = users ? users.length : 0

                if (err)
                    callback(err)
                else if (done === 0) {
                    callback(null, room)
                }
                else {
                    const newUsers = []
                    users.forEach((user) => {
                        helpers.userSanitize(user,
                            (err, user) => {
                                if (err)
                                    callback(err)
                                else {
                                    done--
                                    if (room.users.indexOf(user._id) === -1) {
                                        room.users.push(user._id)
                                        newUsers.push(user)
                                    }
                                    if (done === 0) {
                                        room.save((err, room) => {
                                            callback(err, room, newUsers)
                                        })
                                    }
                                }
                            }
                        )
                    })
                }
            }
        )
    },

    find: (id, callback) => {
        Room.findById(helpers.idSanitize(id), callback)
    },

    populate: (user, openRooms, callback) => {
        const rooms = [],
            messages = {}
        let done = openRooms.length

        if (openRooms.length === 0)
            callback(null, [])

        openRooms.forEach((room) => {
            Room.findById(room.room,
                (err, room) => {
                    const userTo =
                        room.users[0]._id.toString() === user._id.toString() ?
                            room.users[1] : room.users[0]

                    const obj = {
                        name: room.isRoom ? room.name : userTo.name + ' ' + userTo.surname,
                        id: room._id,
                        avatar: room.isRoom ? room.avatar : userTo.avatar,
                        isRoom: room.isRoom
                    }
                    messageManager.last(user, room,
                        (err, message, isStart) => {
                            const {from, date} = message.message
                            const mesText = message.message.message

                            messages[message.room] = [{
                                message: mesText,
                                avatar: from ? from.avatar : '',
                                time: date.valueOf(),
                                system: !from,
                                isStart,
                                me: from ? user._id.toString() === from._id.toString() : false,
                                id: message._id
                            }]
                            rooms.push(obj)
                            if (err)
                                callback(err)
                            else
                                done--
                            if (done === 0) {
                                callback(null, rooms, messages)
                            }
                        })
                }
            ).populate('users')
        })
    },

    rooms: (user, callback) => {
        Room.find({
                users: user
            },
            callback
        )
    }
}