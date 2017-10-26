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
        ref: 'User'
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

const getIfExists = function (userId, userId1) {
    const users = userId1
        ? [userId, userId1]
        : [userId]

    return this.findOne({
        isRoom: false,
        users: {
            $size: users.length,
            $all: users
        }
    })
}

const createUserRoom = function (userId, userId1) {
    if (userId1)
        return this.create({
            creator: userId,
            users: [userId, userId1],
            invites: [null, userId]
        })

    return this.create({
        creator: userId,
        users: [userId],
        invites: [null]
    })
}

roomSchema.statics = {
    getIfExists,
    createUserRoom
}

module.exports = mongoose.model('UserRoom', roomSchema, 'rooms')