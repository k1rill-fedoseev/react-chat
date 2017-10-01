const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId

const roomSchema = mongoose.Schema({
    name: {
        type: String,
        default: 'Default room'
    },
    description: String,
    users: [{
        type: ObjectId,
        ref: 'user',
        index: true
    }],
    invites: [{
        type: ObjectId,
        ref: 'user',
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
        ref: 'user'
    },
    avatar: {
        type: String,
        default: 'images/chat.png'
    }
})

module.exports = mongoose.model('room', roomSchema)