const socketIo = require('socket.io')
const config = require('../cfg')
const log = require('../log')('sockets')
const stripTags = require('striptags')
const sockets = {}

const {
    TRY_SIGN_IN, TRY_SIGN_UP, FETCH_CHATS, TRY_CREATE_ROOM, TRY_CREATE_1_TO_1,
    FETCH_CHAT, FETCH_USERS, FETCH_MESSAGES, TRY_SEND, TRY_INVITE_USERS, TRY_MARK_READ,
    TRY_SEARCH_USERS, FETCH_ONLINE_USERS, END_TYPING, START_TYPING, DELETE_MESSAGES, REMOVE_USER,
    EXIT_REQUEST,
    newMessage, newMessageWithInvite, newMessageWithRemove,
    signInSuccess, signInError, signUpSuccess, signUpError,
    fetchChatsSuccess, fetchChatsError, fetchChatSuccess, fetchChatError,
    createError, sendSuccess, sendError, inviteUsersError,
    fetchUsersSuccess, fetchUsersError, fetchMessagesSuccess, fetchMessagesError,
    searchUsersError, searchUsersSuccess, fetchOnlineUsersSuccess, startTypingResponse, endTypingResponse
} = require('./actions')

const startMessage = (userMessage, chatId) => newMessage({
    message: config.get('startMessage'),
    id: userMessage._id,
    system: true,
    time: userMessage.date.valueOf()
}, chatId)

const Promise = require('../promise')

module.exports = function (server) {
    const io = socketIo(server)

    io.use(
        (socket, next) => {
            const token = new RegExp(config.get('cookie:name') + '=\\w*(?=;?)')
                .exec(socket.handshake.headers.cookie)
            if (token) {
                socket.token = token[0].slice(config.get('cookie:name').length + 1)
                Promise.resolve()
                    .tokenCheck(socket.token)
                    .then(user => {
                        socket.user = user
                        const userId = user._id.toString()
                        sockets[userId] = socket

                        Promise.resolve()
                            .getUserRooms(userId)
                            .then(rooms => {
                                rooms.forEach(room => socket.join(room._id.toString()))
                            })
                            .catch(err => {
                                log.error(err)
                            })

                        return [user]
                    })
                    .usersFilter()
                    .then(([user]) => {
                        socket.send(signInSuccess(user))
                        next()
                    })
                    .catch(err => {
                        if (err)
                            log.error(err)
                        next()
                    })
            }
            else
                next()
        })

    io.on('connection',
        socket => {
            let roomId
            let userId = socket.user
                ? socket.user._id.toString()
                : ''

            socket.on('message', (action) => {
                switch (action.type) {
                    case TRY_SIGN_IN:
                        Promise.resolve()
                            .auth(action.username, action.password)
                            .then(([token, user]) => {
                                socket.user = user
                                userId = user._id.toString()
                                sockets[userId] = socket

                                Promise.resolve()
                                    .getUserRooms(user._id.toString())
                                    .then(rooms => {
                                        rooms.forEach(room => socket.join(room._id.toString()))
                                    })
                                    .catch(err => {
                                        log.error(err)
                                    })

                                return [token, user]
                            })
                            .tokenUserFilter()
                            .then(([token, user]) => {
                                socket.send(signInSuccess(user, token))
                            })
                            .catch(err => {
                                if (err) {
                                    log.error(err)
                                    socket.send(signInError('Server error'))
                                }
                                else
                                    socket.send(signInError('Incorrect username or password'))
                            })
                        break
                    case TRY_SIGN_UP:
                        const {name, surname, password, username, avatar, desc} = action

                        Promise.resolve()
                            .register(name, surname, username, password, avatar, desc)
                            .then(([token, user]) => {
                                socket.user = user
                                userId = user._id.toString()
                                sockets[userId] = socket

                                Promise.resolve()
                                    .getUserRooms(user._id.toString())
                                    .then(rooms => {
                                        rooms.forEach(room => socket.join(room._id.toString()))
                                    })
                                    .catch(err => {
                                        log.error(err)
                                    })

                                return [token, user]
                            })
                            .tokenUserFilter()
                            .then(([token, user]) => {
                                socket.send(signUpSuccess(user, token))
                            })
                            .catch(err => {
                                log.error(err)
                                socket.send(signUpError('Server error / incorrect data'))
                            })
                        break
                    case FETCH_CHATS:
                        Promise.resolve()
                            .getOpenRooms(userId)
                            .openRoomsFilter()
                            .then(arr => {
                                socket.send(fetchChatsSuccess(...arr))
                            })
                            .catch(err => {
                                log.error(err)
                                socket.send(fetchChatsError('Server Error'))
                            })
                        break
                    case FETCH_CHAT:
                        Promise.resolve()
                            .getOpenRoom(userId, action.chatId)
                            .openRoomFilter()
                            .then(room => {
                                socket.send(fetchChatSuccess(room))
                            })
                            .catch(err => {
                                log.error(err)
                                socket.send(fetchChatError('Server Error'))
                            })
                        break
                    case TRY_CREATE_ROOM:
                        Promise.resolve()
                            .createRoom(true, action.name, action.desc, userId, action.avatar)
                            .then(room => {
                                roomId = room._id.toString()
                                return room
                            })
                            .addUsers(action.userIds, userId)
                            .then(args => args[0])
                            .createMessage(undefined, config.get('startMessage'))
                            .then(userMessages => userMessages.forEach(
                                userMessage => {
                                    if (sockets[userMessage.owner.toString()]) {
                                        sockets[userMessage.owner.toString()].join(roomId)
                                        sockets[userMessage.owner.toString()].send(newMessage({
                                            message: config.get('startMessage'),
                                            id: userMessage._id,
                                            time: userMessage.date.valueOf()
                                        }, roomId))
                                    }
                                }
                            ))
                            .catch(err => {
                                log.error(err)
                                socket.send(createError('Server Error'))
                            })
                        break
                    case TRY_CREATE_1_TO_1:
                        Promise.resolve()
                            .checkRoom(userId, action.userId)
                            .then(isExists => {
                                if (isExists)
                                    throw 'Such 1-to-1 chat is already exists'
                            })
                            .createRoom(false, null, null, userId)
                            .then(room => {
                                roomId = room._id.toString()
                                return room
                            })
                            .addUsers(action.userId
                                ? [action.userId]
                                : [], userId)
                            .then(args => args[0])
                            .createMessage(undefined, config.get('startMessage'))
                            .then(userMessages => userMessages.forEach(
                                userMessage => {
                                    if (sockets[userMessage.owner.toString()]) {
                                        sockets[userMessage.owner.toString()].join(roomId)
                                        sockets[userMessage.owner.toString()].send(newMessage({
                                            message: config.get('startMessage'),
                                            id: userMessage._id.toString(),
                                            time: userMessage.date.valueOf()
                                        }, roomId))
                                    }
                                }
                            ))
                            .catch(err => {
                                if (typeof err === 'string')
                                    socket.send(createError(err))
                                else {
                                    log.error(err)
                                    socket.send(createError('Server Error'))
                                }
                            })
                        break
                    case TRY_SEND:
                        const strippedMessage = socket.user.username === 'admin'
                            ? action.message
                            : stripTags(action.message)

                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkMember(userId)
                            .createMessage(userId, strippedMessage)
                            .then(userMessages => userMessages.forEach(
                                userMessage => {
                                    const ownerId = userMessage.owner.toString()
                                    const msg = {
                                        message: strippedMessage,
                                        id: userMessage._id,
                                        from: userId,
                                        time: userMessage.date.valueOf()
                                    }

                                    if (sockets[ownerId] === socket) {
                                        socket.send(sendSuccess(
                                            action.tempId,
                                            action.chatId,
                                            msg
                                        ))
                                    }
                                    else if (sockets[userMessage.owner.toString()]) {
                                        sockets[userMessage.owner.toString()].send(newMessage(msg, action.chatId))
                                    }
                                }
                            ))
                            .catch(err => {
                                log.error(err)
                                socket.send(sendError('Server Error'))
                            })
                        break
                    case FETCH_MESSAGES:
                        Promise.resolve()
                            .getMessages(userId, action.chatId, action.lastMessageId)
                            .messagesFilter()
                            .then(([messages, isFullLoaded]) => {
                                socket.send(fetchMessagesSuccess(action.chatId, messages, isFullLoaded))
                            })
                            .catch(err => {
                                log.error(err)
                                socket.send(fetchMessagesError('Server error'))
                            })
                        break
                    case FETCH_USERS:
                        Promise.resolve()
                            .getUsers(action.userIds)
                            .usersFilter()
                            .then(users => {
                                socket.send(fetchUsersSuccess(users))
                            })
                            .catch(error => {
                                socket.send(fetchUsersError('Server error'))
                            })
                        break
                    case TRY_SEARCH_USERS:
                        Promise.resolve()
                            .searchUsers(action.search)
                            .then(users => {
                                socket.send(searchUsersSuccess(users))
                            })
                            .catch(err => {
                                log.error(err)
                                socket.send(searchUsersError('Server Error'))
                            })
                        break
                    case TRY_INVITE_USERS:
                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkMember(userId)
                            .addUsers(action.userIds, userId)
                            .then(([room, newUsers]) => {
                                return newUsers.map(
                                    newUser => {
                                        const message = `${socket.user.name} ${socket.user.surname} invited ${newUser.name} ${newUser.surname}`
                                        if (sockets[newUser._id.toString()])
                                            sockets[newUser._id.toString()].join(action.chatId)

                                        return () => Promise.resolve(room)
                                            .createMessage(undefined, message)
                                            .then(userMessages => userMessages.forEach(
                                                userMessage => {
                                                    if (sockets[userMessage.owner.toString()])
                                                        sockets[userMessage.owner.toString()].send(newMessageWithInvite(
                                                            {
                                                                message,
                                                                id: userMessage._id,
                                                                time: userMessage.date.valueOf()
                                                            },
                                                            action.chatId,
                                                            newUser._id.toString(),
                                                            userId
                                                        ))
                                                }
                                            ))
                                            .catch(err => {
                                                log.error(err)
                                            })
                                    }
                                )
                                    .reduce(
                                        (chain, promise) => chain.then(promise),
                                        Promise.resolve()
                                    )
                            })
                            .catch(err => {
                                log.error(err)
                                socket.send(inviteUsersError('Server Error'))
                            })
                        break
                    case TRY_MARK_READ:
                        Promise.resolve()
                            .markRead(action.chatId, userId)
                        break
                    case FETCH_ONLINE_USERS:
                        const users = {}

                        action.userIds.forEach(userId => {
                            users[userId] = !!sockets[userId]
                        })
                        socket.send(fetchOnlineUsersSuccess(users))
                        break
                    case START_TYPING:
                        if (io.sockets.adapter.rooms[action.chatId].sockets[socket.id])
                            socket.to(action.chatId).send(startTypingResponse(action.chatId, userId))
                        break
                    case END_TYPING:
                        if (io.sockets.adapter.rooms[action.chatId].sockets[socket.id])
                            socket.to(action.chatId).send(endTypingResponse(action.chatId, userId))
                        break
                    case DELETE_MESSAGES:
                        Promise.resolve()
                            .deleteMessages(userId, action.messageIds)
                            .catch(err => {
                                log.error(err)
                            })
                        break
                    case REMOVE_USER:
                        let room

                        Promise.resolve()
                            .getRoom(action.chatId)
                            .then(foundRoom => {
                                if (!foundRoom.isRoom)
                                    throw Error('Chat must be a room')
                                return room = foundRoom
                            })
                            .checkRemovable(userId, action.userId)
                            .getUser(action.userId)
                            .then(user => {
                                const message = `${socket.user.name} ${socket.user.surname} removed ${user.name} ${user.surname}`

                                return Promise.resolve(room)
                                    .createMessage(undefined, message)
                                    .then(userMessages => {
                                        userMessages.forEach(
                                            userMessage => {
                                                if (sockets[userMessage.owner.toString()])
                                                    sockets[userMessage.owner.toString()].send(newMessageWithRemove(
                                                        {
                                                            message,
                                                            id: userMessage._id,
                                                            time: userMessage.date.valueOf()
                                                        },
                                                        action.chatId,
                                                        action.userId
                                                    ))
                                            }
                                        )
                                        return room
                                    })
                                    .removeUser(action.userId)
                                    .then(() => {
                                        if (sockets[action.userId])
                                            sockets[action.userId].leave(action.chatId)
                                    })
                                    .catch(err => {
                                        log.error(err)
                                    })
                            })
                            .catch(err => {
                                log.error(err)
                            })
                        break
                    case EXIT_REQUEST:
                        if (action.chatId)
                            socket.to(action.chatId).send(endTypingResponse(action.chatId, userId))

                        Object.keys(socket.adapter.rooms).forEach(roomId => {
                            socket.leave(roomId)
                        })

                        delete sockets[userId]
                        break

                }
            })

            socket.on('disconnect', () => {
                if (userId) {
                    //maybe send end typing
                    delete sockets[userId]
                }
            })
        }
    )
}