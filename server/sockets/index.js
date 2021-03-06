const path = require('path')
const socketIo = require('socket.io')
const gm = require('gm')
const {saveUserAvatar, createUserDir, createRoomDir, saveRoomAvatar, saveRoomPhoto} = require('../imagesStore')
const fs = require('fs')
const config = require('../cfg')
const log = require('../log')('sockets')
const stripTags = require('striptags')
const validate = require('./validation')
const {MyError} = require('../models/errors')
const {checkUnique} = require('../helpers')
const User = require('../models/user')
const UserMessage = require('../models/userMessage')
const Message = require('../models/message')
const Room = require('../models/room')
const OpenRoom = require('../models/openRoom')
const UserRoom = require('../models/userRoom')

const {
    SIGN_IN, SIGN_UP, FETCH_CHATS, CREATE_ROOM, CREATE_USER_ROOM,
    FETCH_CHAT, FETCH_USERS, FETCH_MESSAGES, SEND_MESSAGE, INVITE_USERS, MARK_READ,
    SEARCH_USERS, FETCH_ONLINE_USERS, END_TYPING, START_TYPING, DELETE_MESSAGES, REMOVE_USER,
    EXIT_REQUEST, LEAVE_CHAT, DELETE_CHAT, CHAT_NAME, CHAT_AVATAR, CHAT_DESCRIPTION, UPDATE_CHAT_INFO,
    UPDATE_USER_INFO, USER_AVATAR, USER_DESCRIPTION, USER_PASSWORD, RETURN_BACK,
    newMessage, newMessageWithInvite, newMessageWithRemove, signInSuccess, signUpSuccess,
    fetchChatsSuccess, fetchChatSuccess, sendSuccess, fetchUsersSuccess,
    fetchMessagesSuccess, searchUsersSuccess, fetchOnlineUsersSuccess, startTypingResponse,
    endTypingResponse, deleteChatSuccess, newMessageWithInfoUpdate, error, newMessageWithLeft,
    userInfoUpdated
} = require('./actions')

module.exports = function (server) {
    const io = socketIo(server)

    io.use(
        async (socket, next) => {
            try {
                const token = new RegExp(config.cookie.name + '=\\w*(?=;?)')
                    .exec(socket.handshake.headers.cookie)
                if (token && token[0] && token[0].length > 10) {
                    socket.token = token[0].slice(config.cookie.name.length + 1)

                    socket.user = await User.tokenCheck(socket.token)

                    socket.join(socket.user._id.toString())
                    socket.send(signInSuccess(socket.user.filter()))
                }
            }
            catch (err) {
                if (err instanceof MyError) {
                    log.debug(err)
                    socket.send(error(SIGN_IN, err.message))
                }
                else {
                    log.error(err)
                    socket.send(error(SIGN_IN, 'Server error'))
                }
            }
            next()
        })

    io.on('connection',
        socket => {
            let userId = socket.user
                ? socket.user._id.toString()
                : ''

            socket.on('message', async action => {
                if (!validate(action)) {
                    socket.send(error(action.type, 'Validation error'))
                    return
                }

                try {
                    switch (action.type) {
                        case SIGN_IN: {
                            const user = await User.auth(action.username, action.password)
                            await user.genToken().updateLastOnline().save()

                            userId = user._id.toString()

                            socket.user = user
                            socket.token = user.token
                            socket.join(userId)

                            socket.send(signInSuccess(user.filter(), user.token))
                            break
                        }
                        case SIGN_UP: {
                            const {name, surname, password, username, description} = action

                            const user = await User.register(name, surname, username, password, description)
                            userId = user._id.toString()

                            await createUserDir(userId)

                            if (action.avatar) {
                                user.avatar = await saveUserAvatar(userId, action.avatar)
                            }

                            await user.genToken().save()

                            socket.user = user
                            socket.token = user.token
                            socket.join(userId)

                            socket.send(signUpSuccess(user.filter(), user.token))
                            break
                        }
                    }
                }
                catch (err) {
                    if (err instanceof MyError) {
                        log.debug(err)
                        socket.send(error(action.type, err.message))
                    }
                    else {
                        log.error(action)
                        log.error(err)
                        socket.send(error(action.type, 'Server error'))
                    }
                    return
                }

                if (!userId)
                    return

                try {
                    await socket.user.updateLastOnline().save()

                    switch (action.type) {
                        case FETCH_CHATS: {

                            const openRooms = await OpenRoom.getRooms(userId)
                            const [rooms, messages] = await OpenRoom.filter(openRooms)

                            socket.send(fetchChatsSuccess(rooms, messages))
                            break
                        }
                        case FETCH_CHAT: {
                            const openRoom = await OpenRoom.get(userId, action.chatId)

                            socket.send(fetchChatSuccess(openRoom.filter()))
                            break
                        }
                        case CREATE_ROOM: {
                            checkUnique([userId, ...action.userIds])
                            await User.getUsers(action.userIds)
                            const room = await Room.createRoom(userId, action.name, action.description, action.userIds)
                            const roomId = room._id.toString()

                            await createRoomDir(roomId)

                            if (action.avatar) {
                                room.avatar = await saveRoomAvatar(roomId, action.avatar)
                                await room.save()
                            }

                            const userMessages = await Message.createMessage(room, undefined, config.messages.startMessage)
                            userMessages.forEach(
                                userMessage => {
                                    io.to(userMessage.owner.toString()).send(
                                        newMessage(userMessage.filter(), roomId)
                                    )
                                }
                            )
                            break
                        }
                        case CREATE_USER_ROOM: {
                            checkUnique([userId, action.userId])
                            if (action.userId)
                                await User.get(action.userId)
                            let room = await UserRoom.getIfExists(userId, action.userId)

                            if (room) {
                                const openRoom = await OpenRoom.update(room._id.toString(), userId, 0)
                                openRoom._doc.room = room
                                socket.send(fetchChatSuccess(openRoom.filter()))
                            }
                            else {
                                room = await UserRoom.createUserRoom(userId, action.userId)

                                const userMessages = await Message.createMessage(room, undefined, config.messages.startMessage)
                                userMessages.forEach(userMessage => {
                                    io.to(userMessage.owner.toString()).send(
                                        newMessage(userMessage.filter(), room._id.toString())
                                    )
                                })
                            }
                            break
                        }
                        case SEND_MESSAGE: {
                            const strippedMessage = socket.user.username === 'admin'
                                ? action.message
                                : stripTags(action.message)

                            const room = await Room.get(action.chatId)
                            room.checkMember(userId)


                            const attachments = []
                            if (action.attachments)
                                for (let file of action.attachments) {
                                    attachments.push(await saveRoomPhoto(action.chatId, file))
                                }

                            const userMessages = await Message.createMessage(room, userId, strippedMessage, attachments)
                            userMessages.forEach(userMessage => {
                                const ownerId = userMessage.owner.toString()
                                const message = userMessage.filter()

                                socket.to(ownerId).send(newMessage(message, action.chatId))
                                if (ownerId === userId)
                                    socket.send(sendSuccess(
                                        action.tempId,
                                        action.chatId,
                                        message
                                    ))
                            })
                            break
                        }
                        case FETCH_MESSAGES: {
                            const messages = await UserMessage.getPacket(userId, action.chatId, action.lastMessageId)
                            const [filteredMessages, isFullLoaded] = UserMessage.filter(messages)

                            socket.send(fetchMessagesSuccess(action.chatId, filteredMessages, isFullLoaded))
                            break
                        }
                        case FETCH_USERS: {
                            const users = await User.getUsers(action.userIds)
                            const filteredUsers = User.filter(users)

                            socket.send(fetchUsersSuccess(filteredUsers))
                            break
                        }
                        case SEARCH_USERS: {
                            const room = action.chatId
                                ? await Room.get(action.chatId)
                                : undefined
                            const foundUsers = await User.search(action.search, room, socket.user._id)

                            socket.send(searchUsersSuccess(foundUsers))
                            break
                        }
                        case INVITE_USERS: {
                            const room = await Room.get(action.chatId)
                            room.checkMember(userId).checkUsersCount(action.userIds)
                            checkUnique([
                                ...action.userIds,
                                ...room.users.map(userId => userId.toString()),
                                ...room.leftUsers.map(userId => userId.toString())
                            ])

                            const users = await User.getUsers(action.userIds)

                            await room.addUsers(userId, action.userIds).save()

                            for (let user of users) {
                                const message = `${socket.user.name} ${socket.user.surname} invited ${user.name} ${user.surname}`

                                const userMessages = await Message.createMessage(room, undefined, message)
                                userMessages.forEach(userMessage => {
                                    io.to(userMessage.owner.toString()).send(
                                        newMessageWithInvite(userMessage.filter(), action.chatId, user._id.toString(), userId)
                                    )
                                })
                            }
                            break
                        }
                        case MARK_READ: {
                            const openRoom = await OpenRoom.get(userId, action.chatId)
                            await openRoom.markRead().save()
                            break
                        }
                        case FETCH_ONLINE_USERS: {
                            const users = {}

                            await Promise.all(action.userIds.map(async userId => {
                                if (io.sockets.adapter.rooms[userId])
                                    users[userId] = true
                                else {
                                    const user = await User.get(userId)
                                    users[userId] = user.lastOnline.getTime()
                                }
                            }))
                            socket.send(fetchOnlineUsersSuccess(users))
                            break
                        }
                        case START_TYPING: {
                            const room = await Room.get(action.chatId)
                            room.checkMember(userId)
                            room.users.forEach(userId1 => {
                                if (userId !== userId1.toString())
                                    io.to(userId1.toString()).send(startTypingResponse(action.chatId, userId))
                            })
                            break
                        }
                        case END_TYPING: {
                            const room = await Room.get(action.chatId)
                            room.checkMember(userId)
                            room.users.forEach(userId1 => {
                                if (userId !== userId1.toString())
                                    io.to(userId1.toString()).send(endTypingResponse(action.chatId, userId))
                            })
                            break
                        }
                        case DELETE_MESSAGES: {
                            await UserMessage.remove(userId, action.messageIds)
                            break
                        }
                        case REMOVE_USER: {
                            const room = await Room.get(action.chatId)
                            room.checkIsRoom().checkRemovable(userId, action.userId)

                            const user = await User.get(action.userId)
                            const message = `${socket.user.name} ${socket.user.surname} removed ${user.name} ${user.surname}`
                            const userMessages = await Message.createMessage(room, undefined, message)

                            userMessages.forEach(userMessage => {
                                io.to(userMessage.owner.toString()).send(
                                    newMessageWithRemove(userMessage.filter(), action.chatId, action.userId)
                                )
                            })

                            await room.removeUser(action.userId).save()
                            break
                        }
                        case LEAVE_CHAT: {
                            const room = await Room.get(action.chatId)
                            room.checkIsRoom().checkMember(userId)

                            const message = `${socket.user.name} ${socket.user.surname} left room`
                            const userMessages = await Message.createMessage(room, undefined, message)

                            userMessages.forEach(userMessage => {
                                const ownerId = userMessage.owner.toString()

                                io.to(ownerId).send(
                                    (ownerId === userId
                                        ? newMessageWithLeft
                                        : newMessageWithRemove)(userMessage.filter(), action.chatId, userId)
                                )
                            })

                            await room.left(userId).save()
                            break
                        }
                        case DELETE_CHAT: {
                            await UserMessage.removeAllMessages(userId, action.chatId)
                            await OpenRoom.remove(userId, action.chatId)

                            socket.send(deleteChatSuccess(action.chatId))
                            break
                        }
                        case EXIT_REQUEST: {
                            await socket.user.removeToken(socket.token).save()

                            if (action.chatId) {
                                const room = await Room.get(action.chatId)
                                room.checkMember(userId)

                                room.users.forEach(userId1 => {
                                    if (userId !== userId1.toString())
                                        io.to(userId1.toString()).send(endTypingResponse(action.chatId, userId))
                                })
                            }

                            socket.leave(userId)
                            break
                        }
                        case UPDATE_CHAT_INFO: {
                            const room = await Room.get(action.chatId)
                            room.checkIsRoom().checkMember(userId)
                            let message

                            switch (action.field) {
                                case CHAT_NAME:
                                    message = `${socket.user.name} ${socket.user.surname} renamed room to ${action.value}`
                                    room.name = action.value
                                    break
                                case CHAT_AVATAR:
                                    message = `${socket.user.name} ${socket.user.surname} changed avatar`
                                    action.value = room.avatar = await saveRoomAvatar(action.chatId, action.value)
                                    break
                                case CHAT_DESCRIPTION:
                                    message = `${socket.user.name} ${socket.user.surname} changed description to ${action.value}`
                                    room.description = action.value
                                    break
                            }

                            await room.save()
                            const userMessages = await Message.createMessage(room, undefined, message)
                            userMessages.forEach(userMessage => {
                                io.to(userMessage.owner.toString()).send(
                                    newMessageWithInfoUpdate(userMessage.filter(), action.chatId, action.field, action.value)
                                )
                            })
                            break
                        }
                        case UPDATE_USER_INFO: {
                            switch (action.field) {
                                case USER_AVATAR:
                                    action.value = socket.user.avatar = await saveUserAvatar(userId, action.value)
                                    break
                                case USER_DESCRIPTION:
                                    socket.user.description = action.value
                                    break
                                case USER_PASSWORD:
                                    socket.user.checkPassword(action.oldPassword)
                                    socket.user.password = action.value
                                    break
                            }

                            await socket.user.save()
                            io.to(userId).send(userInfoUpdated(action.field, action.value))
                            break
                        }
                        case RETURN_BACK: {
                            const room = await Room.get(action.chatId)
                            const invitedBy = room.returnBack(userId)
                            await room.save()

                            const message = `${socket.user.name} ${socket.user.surname} returned back`
                            const userMessages = await Message.createMessage(room, undefined, message)

                            userMessages.forEach(userMessage => {
                                io.to(userMessage.owner.toString()).send(
                                    newMessageWithInvite(userMessage.filter(), action.chatId, userId, invitedBy
                                        ? invitedBy.toString()
                                        : null)
                                )
                            })
                            break
                        }
                    }
                }
                catch (err) {
                    if (err instanceof MyError) {
                        log.debug(err)
                        socket.send(error(action.type, err.message))
                    }
                    else {
                        log.error(action)
                        log.error(err)
                        socket.send(error(action.type, 'Server error'))
                    }
                }
            })
        }
    )
}