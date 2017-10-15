const socketIo = require('socket.io')
const config = require('../cfg')
const log = require('../log')('sockets')
const stripTags = require('striptags')
const Promise = require('../promise')
const validate = require('./validation')
const {MyError} = require('../promise/errors.js')

const {
    TRY_SIGN_IN, TRY_SIGN_UP, FETCH_CHATS, TRY_CREATE_ROOM, TRY_CREATE_1_TO_1,
    FETCH_CHAT, FETCH_USERS, FETCH_MESSAGES, TRY_SEND, TRY_INVITE_USERS, TRY_MARK_READ,
    TRY_SEARCH_USERS, FETCH_ONLINE_USERS, END_TYPING, START_TYPING, DELETE_MESSAGES, REMOVE_USER,
    EXIT_REQUEST, LEAVE_CHAT, DELETE_CHAT, CHAT_NAME, CHAT_AVATAR, CHAT_DESCRIPTION, UPDATE_CHAT_INFO,
    UPDATE_USER_INFO, USER_AVATAR, USER_DESCRIPTION, USER_PASSWORD,
    newMessage, newMessageWithInvite, newMessageWithRemove,
    signInSuccess, signInError, signUpSuccess, signUpError,
    fetchChatsSuccess, fetchChatsError, fetchChatSuccess, fetchChatError,
    createError, sendSuccess, sendError, inviteUsersError,
    fetchUsersSuccess, fetchUsersError, fetchMessagesSuccess, fetchMessagesError,
    searchUsersError, searchUsersSuccess, fetchOnlineUsersSuccess, startTypingResponse, endTypingResponse,
    deleteChatSuccess, deleteChatError, newMessageWithInfoUpdate, validationError
} = require('./actions')

const errorHandlerSocket = socket => actionCreator => err => {
    if (err instanceof MyError) {
        log.debug(err)
        socket.send(actionCreator(err.message))
    }
    else {
        log.error(err)
        socket.send(actionCreator('Server error'))
    }
}

const logError = err => {
    log.error(err)
}

module.exports = function (server) {
    const io = socketIo(server)

    io.use(
        (socket, next) => {
            const token = new RegExp(config.cookie.name + '=\\w*(?=;?)')
                .exec(socket.handshake.headers.cookie)
            if (token && token[0]) {
                socket.token = token[0].slice(config.cookie.name.length + 1)
                Promise.resolve()
                    .tokenCheck(socket.token)
                    .then(user => {
                        socket.user = user
                        const userId = user._id.toString()
                        socket.join(userId)

                        Promise.resolve()
                            .getUserRooms(userId)
                            .then(rooms => {
                                rooms.forEach(room => socket.join(room._id.toString()))
                            })
                            .catch(logError)

                        return [user]
                    })
                    .usersFilter()
                    .then(([user]) => {
                        socket.send(signInSuccess(user))
                        next()
                    })
                    .catch(err => {
                        if (!err instanceof MyError)
                            logError(err)
                        next()
                    })
            }
            else
                next()
        })

    io.on('connection',
        socket => {
            const errorHandler = errorHandlerSocket(socket)

            let roomId
            let userId = socket.user
                ? socket.user._id.toString()
                : ''

            socket.on('message', action => {
                if (!validate(action)) {
                    socket.send(validationError('Validation error'))
                    return
                }

                switch (action.type) {
                    case TRY_SIGN_IN:
                        Promise.resolve()
                            .auth(action.username, action.password)
                            .then(([token, user]) => {
                                socket.user = user
                                socket.token = token
                                userId = user._id.toString()
                                socket.join(userId)

                                Promise.resolve()
                                    .getUserRooms(user._id.toString())
                                    .then(rooms => {
                                        rooms.forEach(room => socket.join(room._id.toString()))
                                    })
                                    .catch(logError)

                                return [token, user]
                            })
                            .tokenUserFilter()
                            .then(([token, user]) => {
                                socket.send(signInSuccess(user, token))
                            })
                            .catch(errorHandler(signInError))
                        break
                    case TRY_SIGN_UP:
                        const {name, surname, password, username, avatar, description} = action

                        Promise.resolve()
                            .register(name, surname, username, password, avatar, description)
                            .then(([token, user]) => {
                                socket.user = user
                                socket.token = token
                                userId = user._id.toString()
                                socket.join(userId)

                                Promise.resolve()
                                    .getUserRooms(user._id.toString())
                                    .then(rooms => {
                                        rooms.forEach(room => socket.join(room._id.toString()))
                                    })
                                    .catch(logError)

                                return [token, user]
                            })
                            .tokenUserFilter()
                            .then(([token, user]) => {
                                socket.send(signUpSuccess(user, token))
                            })
                            .catch(errorHandler(signUpError))
                        break
                }

                if(!userId)
                    return

                switch (action.type) {
                    case FETCH_CHATS:
                        Promise.resolve()
                            .getOpenRooms(userId)
                            .openRoomsFilter()
                            .then(arr => {
                                socket.send(fetchChatsSuccess(...arr))
                            })
                            .catch(errorHandler(fetchChatsError))
                        break
                    case FETCH_CHAT:
                        Promise.resolve()
                            .getOpenRoom(userId, action.chatId)
                            .openRoomFilter()
                            .then(room => {
                                socket.send(fetchChatSuccess(room))
                            })
                            .catch(errorHandler(fetchChatError))
                        break
                    case TRY_CREATE_ROOM:
                        Promise.resolve()
                            .createRoom(true, action.name, action.description, userId, action.avatar)
                            .then(room => {
                                roomId = room._id.toString()
                                return room
                            })
                            .existingUsersFilter(action.userIds)
                            .addUsers(userId)
                            .then(args => args[0])
                            .createMessage(undefined, config.messages.startMessage)
                            .then(userMessages => userMessages.forEach(
                                userMessage => {
                                    io.to(userMessage.owner.toString()).send(
                                        newMessage(
                                            {
                                                message: config.messages.startMessage,
                                                id: userMessage._id,
                                                time: userMessage.date.valueOf()
                                            },
                                            roomId
                                        )
                                    )
                                }
                            ))
                            .catch(errorHandler(createError))
                        break
                    case TRY_CREATE_1_TO_1:
                        Promise.resolve()
                            .checkRoom(userId, action.userId)
                            .then(room => {
                                if (room) {
                                    Promise.resolve()
                                        .updateOpenRoom(room._id.toString(), userId, 0)
                                        .then(openRoom => {
                                            openRoom.room = room
                                            return openRoom
                                        })
                                        .openRoomFilter()
                                        .then(room => {
                                            socket.send(fetchChatSuccess(room))
                                        })
                                        .catch(errorHandler(createError))
                                }
                                else {
                                    Promise.resolve()
                                        .createRoom(false, null, null, userId)
                                        .then(room => {
                                            roomId = room._id.toString()
                                            return room
                                        })
                                        .existingUsersFilter(action.userId
                                            ? [action.userId]
                                            : [])
                                        .addUsers(userId)
                                        .then(args => args[0])
                                        .createMessage(undefined, config.messages.startMessage)
                                        .then(userMessages => userMessages.forEach(
                                            userMessage => {
                                                io.to(userMessage.owner.toString()).send(
                                                    newMessage(
                                                        {
                                                            message: config.messages.startMessage,
                                                            id: userMessage._id.toString(),
                                                            time: userMessage.date.valueOf()
                                                        },
                                                        roomId
                                                    )
                                                )
                                            }
                                        ))
                                        .catch(errorHandler(createError))
                                }
                            })
                            .catch(errorHandler(createError))

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

                                    socket.to(userMessage.owner.toString()).send(newMessage(msg, action.chatId))
                                    if(ownerId === userId)
                                        socket.send(sendSuccess(
                                            action.tempId,
                                            action.chatId,
                                            msg
                                        ))
                                }
                            ))
                            .catch(errorHandler(sendError))
                        break
                    case FETCH_MESSAGES:
                        Promise.resolve()
                            .getMessages(userId, action.chatId, action.lastMessageId)
                            .messagesFilter()
                            .then(([messages, isFullLoaded]) => {
                                socket.send(fetchMessagesSuccess(action.chatId, messages, isFullLoaded))
                            })
                            .catch(errorHandler(fetchMessagesError))
                        break
                    case FETCH_USERS:
                        Promise.resolve()
                            .getUsers(action.userIds)
                            .usersFilter()
                            .then(users => {
                                socket.send(fetchUsersSuccess(users))
                            })
                            .catch(errorHandler(fetchUsersError))
                        break
                    case TRY_SEARCH_USERS:
                        Promise.resolve()
                            .searchUsers(action.search)
                            .then(users => {
                                socket.send(searchUsersSuccess(users))
                            })
                            .catch(errorHandler(searchUsersError))
                        break
                    case TRY_INVITE_USERS:
                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkMember(userId)
                            .existingUsersFilter(action.userIds)
                            .addUsers(userId)
                            .then(([room, newUsers]) => {
                                return newUsers.map(
                                    newUser => {
                                        const message = `${socket.user.name} ${socket.user.surname} invited ${newUser.name} ${newUser.surname}`

                                        return () => Promise.resolve(room)
                                            .createMessage(undefined, message)
                                            .then(userMessages => userMessages.forEach(
                                                userMessage => {
                                                    io.to(userMessage.owner.toString()).send(
                                                        newMessageWithInvite(
                                                            {
                                                                message,
                                                                id: userMessage._id,
                                                                time: userMessage.date.valueOf()
                                                            },
                                                            action.chatId,
                                                            newUser._id.toString(),
                                                            userId
                                                        )
                                                    )
                                                }
                                            ))
                                            .catch(logError)
                                    }
                                )
                                    .reduce(
                                        (chain, promise) => chain.then(promise),
                                        Promise.resolve()
                                    )
                            })
                            .catch(errorHandler(inviteUsersError))
                        break
                    case TRY_MARK_READ:
                        Promise.resolve()
                            .markRead(action.chatId, userId)
                            .catch(logError)
                        break
                    case FETCH_ONLINE_USERS:
                        const users = {}

                        action.userIds.forEach(userId => {
                            users[userId] = !!io.sockets.adapter.rooms[userId]
                        })
                        socket.send(fetchOnlineUsersSuccess(users))
                        break
                    case START_TYPING:
                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkMember(userId)
                            .then(room => {
                                room.users.forEach(userId1 => {
                                    if (userId !== userId1.toString())
                                        io.to(userId1.toString()).send(startTypingResponse(action.chatId, userId))
                                })
                            })
                            .catch(logError)
                        break
                    case END_TYPING:
                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkMember(userId)
                            .then(room => {
                                room.users.forEach(userId1 => {
                                    if (userId !== userId1.toString())
                                        io.to(userId1.toString()).send(endTypingResponse(action.chatId, userId))
                                })
                            })
                            .catch(logError)
                        break
                    case DELETE_MESSAGES:
                        Promise.resolve()
                            .deleteMessages(userId, action.messageIds)
                            .catch(logError)
                        break
                    case REMOVE_USER:
                        let room

                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkIsRoom()
                            .checkRemovable(userId, action.userId)
                            .then(foundRoom => room = foundRoom)
                            .getUser(action.userId)
                            .then(user => {
                                const message = `${socket.user.name} ${socket.user.surname} removed ${user.name} ${user.surname}`

                                return Promise.resolve(room)
                                    .createMessage(undefined, message)
                                    .then(userMessages => {
                                        userMessages.forEach(
                                            userMessage => {
                                                io.to(userMessage.owner.toString()).send(
                                                    newMessageWithRemove(
                                                        {
                                                            message,
                                                            id: userMessage._id,
                                                            time: userMessage.date.valueOf()
                                                        },
                                                        action.chatId,
                                                        action.userId
                                                    )
                                                )
                                            }
                                        )
                                        return room
                                    })
                                    .removeUser(action.userId)
                                    .catch(logError)
                            })
                            .catch(logError)
                        break
                    case LEAVE_CHAT:
                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkIsRoom()
                            .checkMember(userId)
                            .then(room => {
                                const message = `${socket.user.name} ${socket.user.surname} left room`

                                return Promise.resolve(room)
                                    .createMessage(undefined, message)
                                    .then(userMessages => {
                                        userMessages.forEach(
                                            userMessage => {
                                                io.to(userMessage.owner.toString()).send(
                                                    newMessageWithRemove(
                                                        {
                                                            message,
                                                            id: userMessage._id,
                                                            time: userMessage.date.valueOf()
                                                        },
                                                        action.chatId,
                                                        userId
                                                    )
                                                )
                                            }
                                        )
                                        return room
                                    })
                                    .removeUser(userId)
                                    .catch(logError)
                            })
                            .catch(logError)
                        break
                    case DELETE_CHAT:
                        Promise.resolve()
                            .deleteAllMessages(userId, action.chatId)
                            .deleteOpenRoom(userId, action.chatId)
                            .then(() => {
                                socket.send(deleteChatSuccess(action.chatId))
                            })
                            .catch(errorHandler(deleteChatError))
                        break
                    case EXIT_REQUEST:
                        Promise.resolve(socket.user)
                            .deleteToken(socket.token)

                        if (action.chatId)
                            Promise.resolve()
                                .getRoom(action.chatId)
                                .checkMember(userId)
                                .then(room => {
                                    room.users.forEach(userId1 => {
                                        if (userId !== userId1.toString())
                                            io.to(userId1.toString()).send(endTypingResponse(action.chatId, userId))
                                    })
                                })
                                .catch(logError)

                        Object.keys(socket.adapter.rooms).forEach(roomId => {
                            socket.leave(roomId)
                        })

                        break
                    case UPDATE_CHAT_INFO:
                        let message

                        switch (action.field) {
                            case CHAT_NAME:
                                message = `${socket.user.name} ${socket.user.surname} renamed room to ${action.value}`
                                break
                            case CHAT_AVATAR:
                                message = `${socket.user.name} ${socket.user.surname} changed avatar to ${action.value}`
                                break
                            case CHAT_DESCRIPTION:
                                message = `${socket.user.name} ${socket.user.surname} changed description to ${action.value}`
                                break
                        }

                        Promise.resolve()
                            .getRoom(action.chatId)
                            .checkIsRoom()
                            .checkMember(userId)
                            .changeRoomInfo(action.field, action.value)
                            .createMessage(undefined, message)
                            .then(userMessages => userMessages.forEach(
                                userMessage => {
                                    io.to(userMessage.owner.toString()).send(
                                        newMessageWithInfoUpdate(
                                            {
                                                message,
                                                id: userMessage._id,
                                                time: userMessage.date.valueOf()
                                            },
                                            action.chatId,
                                            action.field,
                                            action.value
                                        )
                                    )
                                }
                            ))
                            .catch(logError)
                        break
                    case UPDATE_USER_INFO:
                        Promise.resolve(socket.user)
                            .changeUserInfo(action.field, action.value, action.oldPassword)
                            .catch(errorHandler(validationError))
                        break
                }
            })
        }
    )
}