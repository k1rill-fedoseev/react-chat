const mongoose = require('mongoose')
const config = require('../cfg')
const User = require('./user')
const ObjectId = mongoose.Schema.Types.ObjectId
const {NotFoundError, MemberError, CheckError} = require('./errors')

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
        ref: 'User'
    }],
    leftUsers: [{
        type: ObjectId,
        ref: 'User'
    }],
    leftUsersInvites: [{
        type: ObjectId,
        ref: 'User'
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

const checkMember = function (userId) {
    if (!this.users.some(id => id.toString() === userId))
        throw new MemberError(`${userId} is not member of ${this._id.toString()}`)

    return this
}

const checkIsRoom = function () {
    if(!this.isRoom)
        throw new CheckError(`${this._id.toString()} is not a room`)

    return this
}

const checkRemovable = function (userId, removingUserId) {
    if (userId === removingUserId)
        throw new CheckError(`${userId} can't remove himself from ${this._id.toString()}`)

    let invitedBy

    this.users.forEach((id, index) => {
        if (id.toString() === removingUserId)
            invitedBy = this.invites[index]
    })

    if (userId !== invitedBy && userId !== this.creator.toString())
        throw new CheckError(`${userId} can't remove ${removingUserId} from ${this._id.toString()}`)

    return this
}

const addUsers = function (invitingUserId, userIds) {
    userIds.forEach(
        userId => {
            this.users.push(userId)
            this.invites.push(invitingUserId)
        }
    )

    return this
}

const removeUser = function (userId) {
    for (let i = 0; i < this.users.length; ++i) {
        if (this.users[i].toString() === userId) {
            this.users.splice(i, 1)
            this.invites.splice(i, 1)
            return this
        }
    }
}

const left = function (userId) {
    for (let i = 0; i < this.users.length; ++i) {
        if (this.users[i].toString() === userId) {
            this.leftUsers.push(this.users[i])
            this.leftUsersInvites.push(this.invites[i])

            this.users.splice(i, 1)
            this.invites.splice(i, 1)
            return this
        }
    }
}

const returnBack = function (userId) {
    for (let i = 0; i < this.leftUsers.length; ++i) {
        if (this.leftUsers[i].toString() === userId) {
            const invitedBy = this.leftUsersInvites[i]

            this.users.push(this.leftUsers[i])
            this.invites.push(invitedBy)

            this.leftUsers.splice(i, 1)
            this.leftUsersInvites.splice(i, 1)
            return invitedBy
        }
    }

    throw new CheckError(`${userId} has not left ${this._id.toString()}`)
}

const existingUsersFilter = function (userIds) {
    const newUsersMap = {}

        userIds.forEach(userId => newUsersMap[userId] = true)
        this.users.forEach(userId => delete newUsersMap[userId.toString()])

        return Object.keys(newUsersMap).splice(0, config.limits.roomMaxUsers)
}

roomSchema.methods = {
    checkMember,
    checkIsRoom,
    checkRemovable,
    addUsers,
    removeUser,
    left,
    returnBack,
    existingUsersFilter
}

const get = function (roomId) {
    return this.findById(roomId)
        .then(room => {
            if (!room)
                throw new NotFoundError(`Room ${roomId} not found`)

            return room
        })
}

const getRooms = function (userId) {
    return this.find({users: userId})
}

const createRoom = function (creatorId, name, description, avatar, userIds) {
    return this.create({
        name: name || undefined,
        description: description || undefined,
        creator: creatorId,
        users: [creatorId, ...userIds],
        invites: [null, ...userIds.map(() => creatorId)],
        avatar: avatar || undefined
    })
}

roomSchema.statics = {
    get,
    getRooms,
    createRoom
}

module.exports = mongoose.model('Room', roomSchema, 'rooms')