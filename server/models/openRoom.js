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
    }
})

openRoomSchema.statics.findOneOrCreate = function (query, callback) {
    const self = this

    self.findOne(query,
        (err, openRoom) => {
            if (err || openRoom)
                callback(err, openRoom)
            else {
                self.create(query, callback)
            }
        }
    )
}

openRoomSchema.index({owner: 1, room: 1})

module.exports = mongoose.model('openroom', openRoomSchema)