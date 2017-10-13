const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

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

userMessageSchema.index({owner: 1, room: 1, date: -1})

module.exports = mongoose.model('UserMessage', userMessageSchema)