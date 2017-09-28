const User = require('../models/user')
const Room = require('../models/room')
const log = require('../log')('PASSWORD')
const mongoose = require('mongoose')
const config = require('../cfg')
const Message = require('../models/message')
const UserMessage = require('../models/userMessage')
const OpenRoom = require('../models/openRoom')

class MyPromise extends Promise {
    getUser(userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                User.findById(userId,
                    (err, user) => {
                        (err || !user)
                            ? reject(err)
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
                            ? reject(err)
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
                            ? reject(err)
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
                        return [message, true]

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
        return this.then((user) =>
            new MyPromise((resolve, reject) => {
                user.lastOnline = Date.now()
                user.save((err, user) => {
                    err
                        ? reject(err)
                        : resolve(users)
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
                            reject()
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
                                reject()
                        }
                    }
                )
            })
        )
    }

    tokenCheck(token) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                if (token) {
                    const attempt = User.encrypt(token, config.get('tokenKey'))

                    User.findOne({hashedToken: attempt},
                        (err, user) => {
                            (err || !user)
                                ? reject(err)
                                : resolve(user)
                        }
                    )
                }
                else
                    reject()
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
                if (room.users.some(item => item.toString() === userId))
                    return room
                throw Error(`${userId} is not member of ${room._id.toString()}`)
            }
        )
    }

    addUsers(userIds) {
        return this.then(room => {
                const newUsersMap = {}
                const newUsers = []

                userIds.forEach(userId => newUsersMap[userId] = true)
                room.users.forEach(userId => delete newUsersMap[userId.toString()])

                return MyPromise.all(Object.keys(newUsersMap).map(
                    newUser => MyPromise.resolve().getUser(newUser).then(user => {
                        room.users.push(user._id)
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
        return this.then(room =>
            new MyPromise((resolve, reject) => {
                Message.create({
                    from: userId || undefined,
                    message: text
                }, (err, message) => {
                    err
                        ? reject(err)
                        : resolve([room, message])
                })
            })
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
                    if (err)
                        reject(err)
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

    tokenUserFilter() {
        return this.then(([token, user]) => [token, {
            username: user.username,
            name: user.name,
            surname: user.surname,
            avatar: user.avatar,
            id: user._id.toString()
        }
        ])
    }

    usersFilter() {
        return this.then(users => users.map(user => ({
            username: user.username,
            avatar: user.avatar,
            name: user.name,
            surname: user.surname,
            id: user._id.toString()
        })))
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

                    for (let row of data) {
                        const [openRoom, message, isFullLoaded] = row
                        let userTo = openRoom.room.users[0].toString()
                        if (userTo === openRoom.owner.toString() && openRoom.room.users.length > 1)
                            userTo = openRoom.room.users[1].toString()

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
                            isRoom: openRoom.room.isRoom,
                            name: openRoom.room.name,
                            id: openRoom.room._id.toString(),
                            avatar: openRoom.room.avatar,
                            newMessages: openRoom.newMessages,
                            to: openRoom.room.isRoom ? '' : userTo.toString(),
                            isFullLoaded
                        })
                    }

                    return [rooms, messages]
                })
        )

    }

    openRoomFilter() {
        return this.then(openRoom => {
            let userTo = openRoom.room.users[0].toString()
            if (userTo === openRoom.owner.toString() && openRoom.room.users.length > 1)
                userTo = openRoom.room.users[1].toString()

            return {
                name: openRoom.room.name,
                id: openRoom.room._id.toString(),
                avatar: openRoom.room.avatar,
                newMessages: openRoom.newMessages,
                isRoom: openRoom.room.isRoom,
                to: userTo.toString(),
                isFullLoaded: true
            }
        })
    }

    messagesFilter(userId) {
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