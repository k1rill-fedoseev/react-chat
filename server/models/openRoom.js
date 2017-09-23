const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId

const openRoomSchema = mongoose.Schema({
    owner: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    room: {
        type: ObjectId,
        ref: 'room'
    },
    newMessages: {
        type: Number,
        default: 0
    }
})

openRoomSchema.index({owner: 1, room: 1})

module.exports = mongoose.model('openroom', openRoomSchema)