const User = require('../models/user')
const Room = require('../models/room')
const log = require('../log')('PASSWORD')
const mongoose = require('mongoose')
const config = require('../cfg')
const Message = require('../models/message')
const UserMessage = require('../models/userMessage')
const OpenRoom = require('../models/openRoom')
const ObjectId = mongoose.Schema.Types.ObjectId

class MyPromise extends Promise {
    getUser(userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                User.findById(userId,
                    (err, user) => {
                        (err || !user) ?
                            reject(err) :
                            resolve(user)
                    }
                )
            })
        )
    }

    getRoom(roomId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                Room.findById(roomId,
                    (err, room) => {
                        (err || !room) ?
                            reject(err) :
                            resolve(room)
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
                        err ?
                            reject(err) :
                            resolve(rooms)
                    })
            })
        )
    } //????

    getOpenRoom(userId, roomId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                OpenRoom.findOne({
                        owner: userId,
                        room: roomId
                    },
                    (err, openRoom) => {
                        err || !openRoom ?
                            reject(err) :
                            resolve(openRoom)
                    }
                ).populate('room')
                    .populate({path: 'room', populate: {path: 'users'}})
            })
        )
    }

    getOpenRooms(userId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                OpenRoom.find({owner: userId},
                    (err, openRooms) => {
                        err ?
                            reject(err) :
                            resolve(openRooms)
                    }
                ).populate('room')
                    .populate({path: 'room', populate: {path: 'users'}})
            })
        )
    }

    getMessages(userId, roomId, lastMessageId) {
        return this.then(() =>
            new MyPromise((resolve, reject) => {
                UserMessage.findById(lastMessageId,
                    (err, message) => {
                        err || !message ?
                            reject(err) :
                            resolve(message)
                    }
                )
            })
                .then((message) => new MyPromise((resolve, reject) => {
                    UserMessage.find({
                            owner: userId,
                            room: roomId,
                            date: {$lt: message.date}
                        },
                        (err, messages) => {
                            err ?
                                reject(err) :
                                resolve(messages)
                        }
                    ).sort({date: -1})
                        .limit(config.get('packetSize') + 1)
                        .populate('message')
                        .populate({path: 'message', populate: {path: 'from'}})
                }))
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
                        err || !message ?
                            reject(err) :
                            resolve(message)
                    }
                ).populate('message')
                    .populate({path: 'message', populate: {path: 'from'}})
            })
                .then((message) =>
                    new MyPromise((resolve, reject) => {
                        UserMessage.findOne({
                                owner: userId,
                                room: roomId,
                                date: {
                                    $lt: message.date
                                }
                            },
                            (err, mes) => {
                                err ?
                                    reject(err) :
                                    resolve([message, !mes])
                            }
                        )
                    })
                )
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
                                err ?
                                    reject(err) :
                                    resolve([token, user])
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
                                    err ?
                                        reject(err) :
                                        resolve([token, user])
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

                    User.findOne({hashedToken: attempt}, (err, user) => {
                        (err || !user) ?
                            reject(err) :
                            resolve(user)
                    })
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
                        err ?
                            reject(err) :
                            resolve(users)
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
                        err ?
                            reject(err) :
                            resolve(room)
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
                const newUsersMap = {}, newUsersArr = [], newUsers = []
                userIds.forEach(userId => newUsersMap[userId] = true)
                room.users.forEach(userId => delete newUsersMap[userId.toString()])
                for (let userId in newUsersMap)
                    newUsersArr.push(userId)

                return MyPromise.all(newUsersArr.map(
                    newUser => MyPromise.resolve().getUser(newUser).then(user => {
                        room.users.push(user._id)
                        newUsers.push(user)
                        return user
                    })
                ))
                    .then(newUsers =>
                        new MyPromise((resolve, reject) => {
                            room.save((err, room) => {
                                err ?
                                    reject(err) :
                                    resolve([room, newUsers])
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
                    err ?
                        reject(err) :
                        resolve([room, message])
                })
            })
        )
            .then(([room, message]) =>
                MyPromise.all(
                    room.users.map(userId =>
                        new MyPromise((resolve, reject) => {
                            OpenRoom.findOneOrCreate({
                                owner: userId,
                                room: room._id
                            }, (err) => {
                                err ?
                                    reject(err) :
                                    resolve()
                            })
                        })
                            .then(() => new MyPromise(
                                (resolve, reject) => {
                                    UserMessage.create({
                                            owner: userId,
                                            message,
                                            room: room._id,
                                            date: message.date
                                        },
                                        (err, userMessage) => {
                                            err ?
                                                reject(err) :
                                                resolve(userMessage)
                                        }
                                    )
                                })
                            )
                    )
                )
            )
    }

    usersFilter() {
        return this.then(users => users.map(user => ({
            username: user.username,
            avatar: user.avatar,
            name: user.name,
            surname: user.surname,
            id: user._id
        })))
    }

    openRoomsFilter() {
        return this.then(openRooms => MyPromise.all(openRooms.map(
            openRoom => MyPromise.resolve()
                .getLastMessage(
                    openRoom.owner.toString(),
                    openRoom.room._id.toString())
                .then(args => [openRoom, ...args])
            ))
                .then(data => {
                    const messages = {}
                    const rooms = []

                    for (let row of data) {
                        const [openRoom, message, isStart] = row
                        const userTo = openRoom.room.users[0]._id.toString() === openRoom.owner.toString() ?
                            openRoom.room.users[1] : openRoom.room.users[0]
                        const {from, date} = message.message
                        messages[message.room] = [{
                            message: message.message.message,
                            avatar: from ? from.avatar : '',
                            time: date.valueOf(),
                            system: !from,
                            isStart,
                            me: from ? openRoom.owner.toString() === from._id.toString() : false,
                            id: message._id.toString()
                        }]
                        rooms.push({
                            name: openRoom.room.isRoom ? openRoom.room.name : userTo.name + ' ' + userTo.surname,
                            id: openRoom.room._id.toString(),
                            avatar: openRoom.room.isRoom ? openRoom.room.avatar : userTo.avatar,
                            isRoom: openRoom.room.isRoom
                        })
                    }

                    return [rooms, messages]
                })
        )

    }

    openRoomFilter() {
        return this.then(openRoom => {
            const userTo = openRoom.room.users[0]._id.toString() === openRoom.owner.toString() ?
                openRoom.room.users[1] : openRoom.room.users[0]

            return {
                name: openRoom.room.isRoom ? openRoom.room.name : userTo.name + ' ' + userTo.surname,
                id: openRoom.room._id.toString(),
                avatar: openRoom.room.isRoom ? openRoom.room.avatar : userTo.avatar,
                isRoom: openRoom.room.isRoom
            }
        })
    }

    messagesFilter(userId) {
        return this.then(messages => {
            const arr = messages.map((message) => ({
                message: message.message.message,
                avatar: message.message.from ? message.message.from.avatar : '',
                time: message.date.valueOf(),
                system: !message.message.from,
                me: message.message.from ? userId.toString() === message.message.from._id.toString() : false,
                id: message._id
            }))
            if (arr.length === config.get('packetSize') + 1)
                arr.pop()
            else
                arr[arr.length - 1].isStart = true
            return arr
        })
    }
}

module.exports = MyPromise