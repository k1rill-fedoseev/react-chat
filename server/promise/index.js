const User = require('../models/user')
const Room = require('../models/room')
const log = require('../log')('PASSWORD')
const mongoose = require('mongoose')
const config = require('../cfg')
const Message = require('../models/message')
const UserMessage = require('../models/userMessage')
const OpenRoom = require('../models/openRoom')
const {NotFoundError, WrongAuthData, MemberError, CheckError} = require('./errors')

class MyPromise extends Promise {
    getUser(userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                User.findById(userId,
                    (err, user) => {
                        (err || !user)
                            ? reject(err || NotFoundError(`User ${userId} not found`))
                            : resolve(user)
                    }
                )
            })
        )
    }

    getUsers(userIds) {
        return this.then(() =>
            MyPromise.all(userIds.map(
                userId => MyPromise.resolve().getUser(userId)
            ))
        )
    }

    getRoom(roomId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                Room.findById(roomId,
                    (err, room) => {
                        (err || !room)
                            ? reject(err || NotFoundError(`Room ${roomId} not found`))
                            : resolve(room)
                    }
                )
            })
        )
    }

    getUserRooms(userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                Room.find({users: userId},
                    (err, rooms) => {
                        err
                            ? reject(err)
                            : resolve(rooms)
                    })
            })
        )
    }

    getOpenRoom(userId, roomId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                OpenRoom.findOne({
                        owner: userId,
                        room: roomId
                    },
                    (err, openRoom) => {
                        err || !openRoom
                            ? reject(err || NotFoundError(`Openroom ${roomId} of ${userId} not found`))
                            : resolve(openRoom)
                    }
                ).populate('room')
            })
        )
    }

    getOpenRooms(userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                OpenRoom.find({owner: userId},
                    (err, openRooms) => {
                        err
                            ? reject(err)
                            : resolve(openRooms)
                    }
                ).populate('room')
            })
        )
    }

    getMessages(userId, roomId, lastMessageId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                UserMessage.findById(lastMessageId,
                    (err, message) => {
                        err
                            ? reject(err)
                            : resolve(message)
                    }
                )
            })
                .then(message => {
                    if (!message)
                        return []

                    return new MyPromise((resolve, reject) => {
                        UserMessage.find({
                                owner: userId,
                                room: roomId,
                                date: {$lt: message.date}
                            },
                            (err, messages) => {
                                err
                                    ? reject(err)
                                    : resolve(messages)
                            }
                        ).sort({date: -1})
                            .limit(config.get('packetSize') + 1)
                            .populate('message')
                    })
                })
        )
    }

    getLastMessage(userId, roomId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                UserMessage.findOne({
                        owner: userId,
                        room: roomId
                    },
                    (err, message) => {
                        err
                            ? reject(err)
                            : resolve(message)
                    }
                ).populate('message')
            })
                .then(message => {
                    if (!message)
                        return [undefined, true]

                    return new MyPromise((resolve, reject) => {
                        UserMessage.findOne({
                                owner: userId,
                                room: roomId,
                                date: {
                                    $lt: message.date
                                }
                            },
                            (err, mes) => {
                                err
                                    ? reject(err)
                                    : resolve([message, !mes])
                            }
                        )
                    })
                })
        )
    }

    updateUserOnline() {
        return this.then(user =>
            new MyPromise((resolve, reject) => {
                user.lastOnline = Date.now()

                user.save((err, user) => {
                    err
                        ? reject(err)
                        : resolve(user)
                })
            })
        )
    }

    updateOpenRoom(roomId, userId, add) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                OpenRoom.findOne({
                    room: roomId,
                    owner: userId
                }, (err, openRoom) => {
                    if (err)
                        reject(err)
                    else if (openRoom) {
                        openRoom.newMessages += add
                        openRoom.save(err => {
                            err
                                ? reject(err)
                                : resolve()
                        })
                    }
                    else {
                        OpenRoom.create({
                            room: roomId,
                            owner: userId,
                            newMessages: add
                        }, err => {
                            err
                                ? reject(err)
                                : resolve()
                        })
                    }
                })
            })
        )
    }

    register(name, surname, username, password, avatar, description) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                User.create({
                        username,
                        password,
                        name,
                        surname,
                        description,
                        avatar
                    },
                    (err, user) => {
                        if (err)
                            reject(err)
                        else {
                            log.trace(username, password)

                            const token = user.genToken()

                            user.save((err) => {
                                err
                                    ? reject(err)
                                    : resolve([token, user])
                            })
                        }
                    }
                )
            })
        )
    }

    auth(username, password) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                User.findOne({username},
                    (err, user) => {
                        if (err)
                            reject(err)
                        else if (!user)
                            reject(NotFoundError('User not found'))
                        else {
                            const attempt = user.encrypt(password)

                            if (attempt === user.hashedPassword) {
                                let token = user.genToken()
                                user.save((err) => {
                                    err
                                        ? reject(err)
                                        : resolve([token, user])
                                })
                            }
                            else
                                reject(WrongAuthData('Wrong username or password'))
                        }
                    }
                )
            })
        )
    }

    tokenCheck(token) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                const attempt = User.encrypt(token, config.get('tokenKey'))

                User.findOne({hashedToken: attempt},
                    (err, user) => {
                        (err || !user)
                            ? reject(err || WrongAuthData('Wrong token'))
                            : resolve(user)
                    }
                )
            })
        )
    }

    searchUsers(search) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                User.find(
                    {$text: {$search: search}},
                    {score: {$meta: 'textScore'}},
                    (err, users) => {
                        err
                            ? reject(err)
                            : resolve(users.map(user => user._id.toString()))
                    }
                ).sort({score: {$meta: 'textScore'}})
            })
        )
    }

    createRoom(isRoom, name, description, userId, avatar) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                Room.create({
                        isRoom,
                        name: name || undefined,
                        description: description || undefined,
                        creator: userId,
                        users: [userId],
                        invites: [undefined],
                        avatar: avatar || undefined
                    },
                    (err, room) => {
                        err
                            ? reject(err)
                            : resolve(room)
                    }
                )
            })
        )
    }

    checkRoom(userId, userId1) {
        const users = userId1
            ? [userId, userId1]
            : [userId]

        return this.then(() =>
            new MyPromise((resolve, reject) => {
                Room.findOne({
                        isRoom: false,
                        users: {
                            $all: users
                        }
                    },
                    (err, room) => {
                        err
                            ? reject(err)
                            : resolve(!!room)
                    }
                )
            })
        )
    }

    checkMember(userId) {
        return this.then(room => {
            if (room.users.some(id => id.toString() === userId))
                return room
            throw MemberError(`${userId} is not member of ${room._id.toString()}`)
        })
    }

    checkIsRoom() {
        this.then(room => {
            if (!room.isRoom)
                throw CheckError('Not a room')
            return room
        })
    }

    checkRemovable(userId, removingUserId) {
        return this.then(room => {
            if (userId === removingUserId)
                throw CheckError(`${userId} can't remove himself from ${room._id.toString()}`)

            let invitedBy

            room.users.forEach((id, index) => {
                if (id.toString() === removingUserId)
                    invitedBy = room.invites[index]
            })

            if (userId === invitedBy || (userId === room.creator.toString() && invitedBy))
                return room

            throw CheckError(`${userId} can't remove ${removingUserId} from ${room._id.toString()}`)
        })
    }

    addUsers(userIds, invitingUserId) {
        return this.then(room => {
                const newUsersMap = {}
                const newUsers = []

                userIds.forEach(userId => newUsersMap[userId] = true)
                room.users.forEach(userId => delete newUsersMap[userId.toString()])

                return MyPromise.all(Object.keys(newUsersMap).map(
                    newUser => MyPromise.resolve()
                        .getUser(newUser)
                        .then(user => {
                            room.users.push(user._id)
                            room.invites.push(invitingUserId)
                            newUsers.push(user)
                            return user
                        })
                ))
                    .then(newUsers =>
                        new MyPromise((resolve, reject) => {
                            room.save((err, room) => {
                                err
                                    ? reject(err)
                                    : resolve([room, newUsers])
                            })
                        })
                    )
            }
        )
    }

    createMessage(userId, text) {
        return this.then(room => {
                return new MyPromise((resolve, reject) => {
                    Message.create({
                        from: userId || undefined,
                        message: text
                    }, (err, message) => {
                        err
                            ? reject(err)
                            : resolve([room, message])
                    })
                })
            }
        )
            .then(([room, message]) =>
                MyPromise.all(
                    room.users.map(roomUserId =>
                        MyPromise.resolve()
                            .updateOpenRoom(room._id.toString(), roomUserId, userId === roomUserId.toString()
                                ? 0
                                : 1)
                            .then(() => new MyPromise(
                                (resolve, reject) => {
                                    UserMessage.create({
                                            owner: roomUserId,
                                            message,
                                            room: room._id,
                                            date: message.date
                                        },
                                        (err, userMessage) => {
                                            err
                                                ? reject(err)
                                                : resolve(userMessage)
                                        }
                                    )
                                })
                            )
                    )
                )
            )
    }

    markRead(roomId, userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                OpenRoom.findOne({
                    room: roomId,
                    owner: userId
                }, (err, openRoom) => {
                    if (err || !openRoom)
                        reject(err || NotFoundError(`Openroom ${roomId} of ${userId} not found`))
                    else if (openRoom) {
                        openRoom.newMessages = 0
                        openRoom.save(err => {
                            err
                                ? reject(err)
                                : resolve()
                        })
                    }
                })
            })
        )
    }

    deleteMessages(userId, messageIds) {
        return this.then(() =>
            MyPromise.all(messageIds.map(
                messageId =>
                    new MyPromise((resolve, reject) => {
                        UserMessage.deleteOne({
                            owner: userId,
                            _id: messageId
                        }, err => {
                            err
                                ? reject(err)
                                : resolve()
                        })
                    })
            ))
        )
    }

    removeUser(userId) {
        return this.then(room =>
            new MyPromise((resolve, reject) => {
                [...room.users].forEach((user, index) => {
                    if (user.toString() === userId) {
                        room.users.splice(index, 1)
                        room.invites.splice(index, 1)
                    }
                })

                room.save((err, room) =>
                    err
                        ? reject(err)
                        : resolve(room)
                )
            })
        )
    }

    tokenUserFilter() {
        return this.then(([token, user]) => [
            token,
            {
                username: user.username,
                name: user.name,
                surname: user.surname,
                avatar: user.avatar,
                id: user._id.toString()
            }
        ])
    }

    usersFilter() {
        return this.then(users => users.map(
            user => ({
                username: user.username,
                avatar: user.avatar,
                name: user.name,
                surname: user.surname,
                id: user._id.toString()
            })
        ))
    }

    openRoomsFilter() {
        return this.then(openRooms =>
            MyPromise.all(openRooms.map(
                openRoom => MyPromise.resolve()
                    .getLastMessage(
                        openRoom.owner.toString(),
                        openRoom.room._id.toString())
                    .then(args => [openRoom, ...args])
            ))
                .then(data => {
                    const messages = []
                    const rooms = []

                    data.forEach(row => {
                        const [openRoom, message, isFullLoaded] = row
                        const {room, owner, newMessages} = openRoom
                        const {isRoom, name, avatar, _id, users, invites} = room

                        let userTo = users[0] && users[0].toString()
                        if (userTo === owner.toString() && users.length > 1)
                            userTo = users[1].toString()

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

                        rooms.push({
                            isRoom,
                            name,
                            id: _id.toString(),
                            avatar,
                            newMessages,
                            to: isRoom
                                ? ''
                                : userTo,
                            users: users.map(user => user.toString()),
                            invites: invites.map(invite => invite
                                ? invite.toString()
                                : ''),
                            isFullLoaded
                        })
                    })

                    return [rooms, messages]
                })
        )

    }

    openRoomFilter() {
        return this.then(openRoom => {
            const {room, owner} = openRoom
            const {isRoom, name, avatar, _id, newMessages, users, invites} = room

            let userTo = users[0] && users[0].toString()
            if (userTo === owner.toString() && users.length > 1)
                userTo = users[1].toString()

            return {
                name,
                id: _id.toString(),
                avatar,
                newMessages,
                isRoom,
                to: isRoom
                    ? ''
                    : userTo,
                users: users.map(user => user.toString()),
                invites: invites.map(invite => invite
                    ? invite.toString()
                    : ''),
                isFullLoaded: true
            }
        })
    }

    messagesFilter() {
        return this.then(messages => {
            const arr = messages.map((message) => ({
                message: message.message.message,
                time: message.date.valueOf(),
                from: message.message.from
                    ? message.message.from.toString()
                    : undefined,
                id: message._id.toString()
            }))
            if (arr.length === config.get('packetSize') + 1)
                arr.pop()
            else
                return [arr, true]
            return [arr, false]
        })
    }
}

module.exports = MyPromise