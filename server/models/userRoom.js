const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const roomSchema = mongoose.Schema({
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
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('UserRoom', roomSchema, 'rooms')