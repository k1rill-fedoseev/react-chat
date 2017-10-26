const mongoose = require('mongoose')
const config = require('../cfg')
const ObjectId = mongoose.Schema.Types.ObjectId
const {NotFoundError} = require('./errors')

const userMessageSchema = mongoose.Schema({
    message: {
        type: ObjectId,
        ref: 'Message',
        required: true
    },
    room: {
        type: ObjectId,
        ref: 'Room',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

const getPacket = async function (userId, roomId, lastMessageId) {
    const message = await this.findById(lastMessageId)

    if (!message)
        throw new NotFoundError(`UserMessage ${lastMessageId} not found`)

    return this.find({
        owner: userId,
        room: roomId,
        date: {$lt: message.date}
    })
        .sort({date: -1})
        .limit(config.limits.packetSize + 1)
        .populate('message')
}

const getLast = async function (userId, roomId) {
    const message = await this.findOne({
        owner: userId,
        room: roomId
    })
        .populate('message')

    if (!message)
        return [undefined, true]

    const prevMessage = await this.findOne({
        owner: userId,
        room: roomId,
        date: {
            $lt: message.date
        }
    })

    return [message, !prevMessage]
}

const filter = function (messages) {
    const arr = messages.map(message => ({
        message: message.message.message,
        time: message.date.valueOf(),
        from: message.message.from
            ? message.message.from.toString()
            : undefined,
        id: message._id.toString()
    }))

    if (arr.length === config.messages.packetSize + 1)
        arr.pop()
    else
        return [arr, true]
    return [arr, false]
}

const remove = function (userId, messageIds) {
    Promise.all(messageIds.map(
        messageId =>
            this.deleteOne({
                owner: userId,
                _id: messageId
            })
        )
    )
}

const removeAllMessages = function (userId, roomId) {
    return this.deleteMany({
        owner: userId,
        room: roomId
    })
}

userMessageSchema.statics = {
    getPacket,
    getLast,
    filter,
    remove,
    removeAllMessages
}

userMessageSchema.index({owner: 1, room: 1, date: -1})

module.exports = mongoose.model('UserMessage', userMessageSchema)