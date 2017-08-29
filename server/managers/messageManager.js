const mongoose = require('mongoose'),
    Message = require('../models/message'),
    UserMessage = require('../models/userMessage'),
    OpenRoom = require('../models/openRoom'),
    helpers = require('./helpers'),
    config = require('../cfg')
ObjectId = mongoose.Types.ObjectId

module.exports = {
    create: (options, callback) => {
        Message.create({
                from: options.from || undefined,
                message: options.message
            },
            (err, message) => {
                if (err)
                    callback(err)
                else {
                    helpers.roomSanitize(options.room,
                        (err, room) => {
                            if (err)
                                callback(err)
                            else {
                                let users = room.users

                                users.forEach((user) => {
                                    OpenRoom.findOneOrCreate({
                                        owner: user,
                                        room
                                    }, (err) => {
                                        if (err)
                                            callback(err)
                                        else {
                                            UserMessage.create({
                                                    owner: user,
                                                    message,
                                                    room,
                                                    date: message.date
                                                },
                                                (err, userMessage) => {
                                                    if (err)
                                                        callback(err)
                                                    else
                                                        callback(null, userMessage, user.toString(), options.from)
                                                }
                                            )
                                        }
                                    })
                                })
                            }
                        }
                    )
                }
            }
        )
    },

    list: (owner, room, lastId, callback) => {
        UserMessage.findById(lastId,
            (err, message) => {
                if (err)
                    callback(err)
                else {
                    UserMessage.find({
                            owner, room,
                            date: {$lt: message.date}
                        },
                        (err, messages) => {
                            if (err)
                                callback(err)
                            else if (messages.length) {
                                const arr = messages.map((message) => ({
                                    message: message.message.message,
                                    avatar: message.message.from ? message.message.from.avatar : '',
                                    time: message.date.valueOf(),
                                    system: !message.message.from,
                                    me: message.message.from ? owner._id.toString() === message.message.from._id.toString() : false,
                                    id: message._id
                                }))
                                if (arr.length === config.get('packetSize') + 1)
                                    arr.pop()
                                else
                                    arr[arr.length - 1].isStart = true
                                callback(null, arr)
                            }
                            else
                                callback(null, null)
                        }
                    ).sort({date: -1})
                        .limit(config.get('packetSize') + 1)
                        .populate('message')
                        .populate({path: 'message', populate: {path: 'from'}})
                }
            }
        )
    },

    rooms: (owner, callback) => {
        OpenRoom.find({
                owner: owner
            },
            callback
        )
    },

    last: (owner, room, callback) => {
        UserMessage.findOne({
                owner, room
            },
            (err, message) => {
                if (err)
                    callback(err)
                else {
                    UserMessage.findOne({
                            owner, room,
                            date: {
                                $lt: message.date
                            }
                        },
                        (err, mes) => {
                            if(err)
                                callback(err)
                            else{
                                callback(null, message, !mes)
                            }
                        }
                    )
                }
            }
        ).populate('message')
            .populate({path: 'message', populate: {path: 'from'}})
    },

    delete: (ids) => {

    }
}