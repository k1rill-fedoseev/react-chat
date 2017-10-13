const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const roomSchema = mongoose.Schema({
    name: String,
    description: {
        type: String,
        default: 'No description'
    },
    users: [{
        type: ObjectId,
        ref: 'User',
        index: true
    }],
    invites: [{
        type: ObjectId,
        ref: 'User',
    }],
    isRoom: {
        type: Boolean,
        default: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    avatar: {
        type: String,
        default: 'images/chat.png'
    }
})

module.exports = mongoose.model('Room', roomSchema, 'rooms')