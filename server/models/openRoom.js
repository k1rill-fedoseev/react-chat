const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const openRoomSchema = mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: ObjectId,
        ref: 'Room',
        required: true
    },
    newMessages: {
        type: Number,
        default: 0
    }
})

openRoomSchema.index({owner: 1, room: 1})

module.exports = mongoose.model('OpenRoom', openRoomSchema)