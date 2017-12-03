const mongoose = require('mongoose')
const OpenRoom = require('./openRoom')
const UserMessage = require('./userMessage')
const ObjectId = mongoose.Schema.Types.ObjectId

const messageSchema = mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'User'
    },
    message: String,
    attachments: [String],
    date: {
        type: Date,
        default: Date.now
    }
})

const createMessage = function (room, senderId, text, attachments) {
    return this.create({
        from: senderId || undefined,
        message: text,
        attachments
    })
        .then(message =>
            Promise.all(
                room.users.map(async roomUserId => {
                    await OpenRoom.update(room._id.toString(), roomUserId, senderId === roomUserId.toString()
                        ? 0
                        : 1)

                    return await UserMessage.create({
                        owner: roomUserId,
                        message,
                        room: room._id,
                        date: message.date
                    })
                })
            )
        )
}

messageSchema.statics = {
    createMessage
}

module.exports = mongoose.model('Message', messageSchema)