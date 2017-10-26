const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const UserMessage = require('./userMessage')
const {NotFoundError} = require('./errors')

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

const filterOpenRoom = function () {
    const {room, newMessages} = this
    const {isRoom, name, avatar, _id, users, invites, description} = room

    if (isRoom)
        return {
            name,
            id: _id.toString(),
            avatar,
            description,
            newMessages,
            isRoom,
            users: users.map(user => user.toString()),
            invites: invites.map(invite => invite
                ? invite.toString()
                : ''),
            isFullLoaded: true
        }

    return {
        id: _id.toString(),
        newMessages,
        isRoom,
        users: users.map(user => user.toString()),
        isFullLoaded: true
    }
}

const markRead = function () {
    this.newMessages = 0
    return this
}

openRoomSchema.methods = {
    filter: filterOpenRoom,
    markRead
}

const get = function (userId, roomId) {
    return this.findOne({
        owner: userId,
        room: roomId
    })
        .populate('room')
        .then(openRoom => {
            if (!openRoom)
                throw new NotFoundError(`Openroom ${roomId} of ${userId} not found`)

            return openRoom
        })
}

const getRooms = function (userId) {
    return this.find({owner: userId})
        .populate('room')
}

const update = function (roomId, userId, add) {
    return this.findOne({
        room: roomId,
        owner: userId
    })
        .then(openRoom => {
            if (openRoom) {
                openRoom.newMessages += add
                return openRoom.save()
            }
            else {
                return this.create({
                    room: roomId,
                    owner: userId,
                    newMessages: add
                })
            }
        })
}

const remove = function (userId, roomId) {
    return this.deleteOne({
        owner: userId,
        room: roomId
    })
}

const filter = function (openRooms) {
    return Promise.all(openRooms.map(
        async openRoom => {
            const [message, isFullLoaded] = await UserMessage.getLast(
                openRoom.owner.toString(),
                openRoom.room._id.toString())

            return [openRoom, message, isFullLoaded]
        }
    ))
        .then(data => {
            const messages = []
            const rooms = []

            data.forEach(row => {
                const [openRoom, message, isFullLoaded] = row
                const {room, newMessages} = openRoom
                const {isRoom, name, avatar, _id, users, invites, description} = room

                if (message) {
                    const {from, date} = message.message

                    messages.push({
                        message: message.message.message,
                        from: from
                            ? from.toString()
                            : undefined,
                        time: date.valueOf(),
                        id: message._id.toString()
                    })
                }
                else
                    messages.push({})

                if (isRoom)
                    rooms.push({
                        isRoom,
                        name,
                        id: _id.toString(),
                        avatar,
                        description,
                        newMessages,
                        users: users.map(user => user.toString()),
                        invites: invites.map(invite => invite
                            ? invite.toString()
                            : ''),
                        isFullLoaded
                    })
                else
                    rooms.push({
                        isRoom,
                        id: _id.toString(),
                        newMessages,
                        users: users.map(user => user.toString()),
                        isFullLoaded
                    })
            })

            return [rooms, messages]
        })
}

openRoomSchema.statics = {
    get,
    getRooms,
    update,
    remove,
    filter
}

openRoomSchema.index({owner: 1, room: 1})

module.exports = mongoose.model('OpenRoom', openRoomSchema)