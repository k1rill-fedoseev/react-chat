const socketIo = require('socket.io'),
    config = require('../cfg'),
    log = require('../log')('sockets'),
    userManager = require('../managers/userManager'),
    roomManager = require('../managers/roomManager'),
    messageManager = require('../managers/messageManager'),
    helpers = require('../managers/helpers'),
    stripTags = require('striptags'),
    sockets = {}

const {
    TRY_SIGN_IN, TRY_SIGN_UP, FETCH_CHATS, TRY_CREATE_ROOM, TRY_CREATE_1_TO_1,
    FETCH_CHAT, FETCH_USERS, FETCH_MESSAGES, TRY_SEND, TRY_INVITE_USERS,
    newMessage,
    signInSuccess, signInError, signUpSuccess, signUpError,
    fetchChatsSuccess, fetchChatsError, fetchChatSuccess, fetchChatError,
    createError, sendSuccess, sendError, inviteUsersError,
    fetchUsersSuccess, fetchUsersError, fetchMessagesSuccess, fetchMessagesError
} = require('./actions')

const startMessage = (userMessage, chatId) => newMessage({
    message: config.get('startMessage'),
    id: userMessage._id,
    system: true,
    time: userMessage.date.valueOf()
}, chatId)

module.exports = function (server) {
    const io = socketIo(server)

    io.use(
        (socket, next) => {
            const name = config.get('cookie:name')
            const token = new RegExp(name + '=\\w*(?=;?)')
                .exec(socket.handshake.headers.cookie)
            if (token) {
                socket.token = token[0].slice(name.length + 1)
                userManager.tokenCheck(socket.token,
                    (err, user) => {
                        if (err)
                            log.error(err)
                        if (user) {
                            socket.user = user
                            sockets[socket.user._id] = socket
                            socket.send(signInSuccess(user.name, user.surname, user.avatar))
                        }
                        next()
                    }
                )
            }
            else
                next()
        })

    io.on('connection',
        (socket) => {
            socket.on('message', (action) => {
                switch (action.type) {
                    case TRY_SIGN_IN:
                        userManager.auth(action.username, action.password,
                            (err, token, user) => {
                                socket.user = user
                                if (err) {
                                    log.error(err)
                                    socket.send(signInError('Server error'))
                                }
                                else if (!token)
                                    socket.send(signInError('Incorrect username or password'))
                                else {
                                    socket.send(signInSuccess(user.name, user.surname, user.avatar, token))
                                    sockets[socket.user._id] = socket
                                }
                            })
                        break
                    case TRY_SIGN_UP:
                        userManager.register(
                            action.name,
                            action.surname,
                            action.username,
                            action.password,
                            action.avatar,
                            action.desc,
                            (err, token, user) => {
                                socket.user = user
                                if (err) {
                                    log.error(err)
                                    socket.send(signUpError('Server error / incorrect data'))
                                }
                                else {
                                    socket.send(signUpSuccess(user.name, user.surname, user.avatar, token))
                                    sockets[socket.user._id] = socket
                                }
                            })
                        break
                    case FETCH_CHATS:
                        messageManager.rooms(socket.user,
                            (err, rooms) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(fetchChatsError('Server Error'))
                                }
                                else {
                                    roomManager.populate(socket.user, rooms,
                                        (err, chats, messages) => {
                                            if (err) {
                                                log.error(err)
                                                socket.send(fetchChatsError('Server Error'))
                                            }
                                            else {
                                                socket.send(fetchChatsSuccess(chats, messages))
                                            }
                                        }
                                    )
                                }
                            }
                        )
                        break
                    case FETCH_CHAT:
                        roomManager.isMember(socket.user, action.chatId,
                            (err, result) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(fetchChatError('Server Error'))
                                }
                                else if (result) {
                                    roomManager.populate(socket.user, [{room: action.chatId}],
                                        (err, rooms) => {
                                            if (err) {
                                                log.error(err)
                                                socket.send(fetchChatError('Server Error'))
                                            }
                                            else
                                                socket.send(fetchChatSuccess(rooms[0]))
                                        }
                                    )
                                }
                            })
                        break
                    case TRY_CREATE_ROOM:
                        roomManager.create(socket.user, {
                                name: action.name,
                                description: action.desc,
                                avatar: action.avatar
                            },
                            (err, room) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(createError('Server Error'))
                                }
                                else if (room) {
                                    const roomId = room._id.toString()
                                    roomManager.addUsers(action.users, room,
                                        (err, room) => {
                                            if (err) {
                                                log.error(err)
                                                socket.send(createError('Server Error'))
                                            }
                                            else {
                                                messageManager.create({
                                                        room,
                                                        message: config.get('startMessage')
                                                    },
                                                    (err, userMessage, user) => {
                                                        if (err) {
                                                            log.error(err)
                                                            socket.send(createError('Server Error'))
                                                        }
                                                        else if (userMessage) {
                                                            if (sockets[user]) {
                                                                sockets[user]
                                                                    .join(roomId)
                                                                    .send(startMessage(userMessage, roomId))
                                                            }
                                                        }
                                                    }
                                                )
                                            }
                                        }
                                    )
                                }
                            }
                        )
                        break
                    case TRY_CREATE_1_TO_1:
                        if (action.user) {
                            roomManager.create(socket.user, {
                                    isRoom: false,
                                    name: action.name,
                                    description: action.desc,
                                    avatar: action.avatar
                                },
                                (err, room) => {
                                    if (err) {
                                        log.error(err)
                                        socket.send(createError('Server Error'))
                                    }
                                    else if (room) {
                                        const roomId = room._id.toString()

                                        roomManager.addUsers([action.user], room,
                                            (err, room) => {
                                                if (err) {
                                                    log.error(err)
                                                    socket.send(createError('Server Error'))
                                                }
                                                else {
                                                    messageManager.create({
                                                            room,
                                                            message: config.get('startMessage')
                                                        },
                                                        (err, userMessage, user) => {
                                                            if (err) {
                                                                log.error(err)
                                                                socket.send(createError('Server Error'))
                                                            }
                                                            else if (userMessage) {
                                                                if (sockets[user]) {
                                                                    sockets[user]
                                                                        .join(roomId)
                                                                        .send(startMessage(userMessage, roomId))
                                                                }
                                                            }
                                                        }
                                                    )
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        }
                        break
                    case FETCH_USERS:
                        userManager.smartFind(action.search,
                            (err, users) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(fetchUsersError('Server Error'))
                                }
                                else
                                    socket.send(fetchUsersSuccess(
                                        users.map(
                                            (user) => ({
                                                username: user.username,
                                                avatar: user.avatar,
                                                name: user.name,
                                                surname: user.surname,
                                                id: user._id
                                            })
                                        )
                                    ))
                            }
                        )
                        break
                    case TRY_SEND:
                        const strippedMessage = socket.user.username === 'admin' ?
                            action.message : stripTags(action.message)
                        messageManager.create({
                                room: action.chatId,
                                message: strippedMessage,
                                from: socket.user
                            },
                            (err, userMessage, user, from) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(sendError('Server Error', action.tempId))
                                }
                                else if (userMessage) {
                                    if (sockets[user]) {
                                        if (sockets[user] !== socket) {
                                            sockets[user].send(newMessage({
                                                message: action.message,
                                                id: userMessage._id,
                                                me: false,
                                                time: userMessage.date.valueOf(),
                                                avatar: from.avatar
                                            }, action.chatId))
                                        }
                                        else {
                                            socket.send(sendSuccess(
                                                action.tempId,
                                                action.chatId,
                                                {
                                                    message: action.message,
                                                    id: userMessage._id,
                                                    me: true,
                                                    time: userMessage.date.valueOf(),
                                                    avatar: from.avatar
                                                }
                                            ))
                                        }
                                    }
                                }
                            }
                        )
                        break
                    case FETCH_MESSAGES:
                        messageManager.list(socket.user, action.chatId, action.lastMessageId,
                            (err, messages) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(fetchMessagesError('Server error'))
                                }
                                else
                                    socket.send(fetchMessagesSuccess(action.chatId, messages))
                            }
                        )
                        break
                    case TRY_INVITE_USERS:
                        roomManager.isMember(socket.user, action.chatId,
                            (err, result) => {
                                if (err) {
                                    log.error(err)
                                    socket.send(inviteUsersError('Server Error'))
                                }
                                else if (result) {
                                    roomManager.addUsers(action.users, action.chatId,
                                        (err, room, newUsers) => {
                                            if (err) {
                                                log.error(err)
                                                socket.send(inviteUsersError('Server Error'))
                                            }
                                            else {
                                                newUsers.forEach(user => {
                                                    messageManager.create({
                                                            room,
                                                            message: `${socket.user.name} ${socket.user.surname} invited ${user.name} ${user.surname}`
                                                        },
                                                        (err, userMessage, userId) => {
                                                            if (err) {
                                                                log.error(err)
                                                                socket.send(createError('Server Error'))
                                                            }
                                                            else if (userMessage) {
                                                                if (sockets[userId]) {
                                                                    sockets[userId]
                                                                        .send(newMessage({
                                                                            message: `${socket.user.name} ${socket.user.surname} invited ${user.name} ${user.surname}`,
                                                                            id: userMessage._id,
                                                                            system: true,
                                                                            time: userMessage.date.valueOf(),
                                                                        }, action.chatId))
                                                                }
                                                            }
                                                        }
                                                    )
                                                })
                                            }
                                        }
                                    )
                                }
                            })
                        break
                }
            })

            socket.on('disconnect', () => {
                if (socket.user)
                    delete sockets[socket.user._id]
            })
        }
    )

    /*io.use(
     (socket, next) => {
     let name = config.get('cookie:name');
     let token = new RegExp(name + "=\\w*(?=;?)")
     .exec(socket.handshake.headers.cookie);
     if (token) {
     socket.token = token[0].slice(name.length + 1);
     userManager.tokenCheck(socket.token,
     (err, user) => {
     if (err)
     log.error(err);
     if (user) {
     socket.user = user;
     sockets[socket.user._id] = socket;
     next();
     }
     }
     );
     }
     });

     io.on('connection',
     (socket) => {
     roomManager.rooms(socket.user,
     (err, rooms) => {
     if (err)
     log.error(err);
     else {
     socket.emit('set-user', {
     id: socket.user._id,
     photo: socket.user.photo,
     name: socket.user.name,
     surname: socket.user.surname
     });
     rooms.forEach(room => socket.join(room._id));
     }
     }
     );

     socket.on('messages',
     (roomId) => {
     roomManager.isMember(socket.user, roomId,
     (err, result) => {
     if (err)
     log.error(err);
     else if (result) {
     messageManager.list(socket.user, roomId,
     (err, messages) => {
     if (err)
     log.error(err);
     else
     socket.emit('messages', helpers.messagesFilter(messages));
     }
     );
     }
     }
     );
     }
     );

     socket.on('new-message',
     (message) => {
     roomManager.isMember(socket.user, message.room,
     (err, result) => {
     if (err)
     log.error(err);
     else if (result) {
     messageManager.create({
     from: socket.user,
     message: stripTags(message.message),
     room: message.room
     },
     (err, userMessage) => {
     if (err) {
     log.error(err);
     }
     else {
     let newMes = {
     id: userMessage._id,
     message: message.message,
     room: message.room,
     from: {
     id: socket.user._id,
     name: socket.user.name,
     surname: socket.user.surname,
     photo: socket.user.photo,
     }
     };
     socket.broadcast.to(message.room).emit('new-message', newMes);
     socket.emit('send-ok', {
     transId: message.transId,
     id: newMes.id
     });
     }
     }
     );
     }
     }
     );
     }
     );

     socket.on('users',
     (search) => {
     userManager.smartFind(search,
     (err, users) => {
     if (err)
     log.error(err);
     else
     socket.emit('users', users);
     }
     )
     }
     );

     socket.on('add-users',
     (data) => {
     roomManager.isMember(socket.user, data.room,
     (err, result) => {
     if (err)
     log.error(err);
     else if (result) {
     roomManager.addUsers(data.users, data.room,
     (err, room) => {
     if (err)
     log.error(err);
     else {
     data.users
     messageManager.create({
     room: room,
     message: socket.user.name + ' ' + socket.user.surname + ' invited ' + user.name + ' ' + user.surname
     },
     (err, userMessage) => {
     sockets[user._id].join(data.room);
     io.to(data.room).emit('new-message', {
     id: userMessage._id,
     message: socket.user.name + ' ' + socket.user.surname + ' invited ' + user.name + ' ' + user.surname,
     room: data.room
     });
     }
     )
     }
     }
     );
     }
     }
     );
     }
     );

     socket.on('new-chat',
     (chat) => {
     if(chat.room) {
     roomManager.isMember(socket.user, chat.room,
     (err, result) => {
     if (err)
     log.error(err);
     else if (result) {
     roomManager.populate(socket.user, [chat],
     (err, rooms) => {
     socket.emit('new-chat', rooms[0]);
     }
     );
     }
     }
     );
     }
     else{
     roomManager.populate(socket.user, [chat],
     (err, rooms) => {
     socket.emit('new-chat', rooms[0]);
     }
     );
     }
     }
     );

     socket.on('create-chat',
     (chat) => {
     if (chat.personal) {
     messageManager.create({
     from: socket.user._id,
     to: chat.users[0],
     message: 'Send your messages here'
     },
     (err, userMessage) => {
     if (err)
     log.error(err);
     else if (userMessage) {
     sockets[chat.users[0]].join('123');
     socket.emit('new-message', {
     id: userMessage._id,
     message: 'Send your messages here',
     to: chat.users
     });
     }
     }
     );
     }
     else {
     roomManager.create(socket.user, {
     name: chat.name || undefined,
     description: chat.description || undefined,
     photo: chat.photo || undefined
     },
     (err, room) => {
     if (err)
     log.error(err);
     else if (room) {
     var roomId = room._id.toString();

     //socket.join(roomId);
     roomManager.addUsers(chat.users, room,
     (err, room) => {
     if(err)
     log.error(err);
     else {
     messageManager.create({
     room: room,
     message: 'Send your messages here'
     },
     (err, userMessage, user) => {
     if (err)
     log.error(err);
     else if (userMessage) {
     if (sockets[user]) {
     sockets[user]
     .join(roomId)
     .emit('new-message', {
     id: userMessage._id,
     message: 'Send your messages here',
     room: roomId
     });
     }
     }
     }
     );
     }
     }
     );
     }
     }
     );
     }
     }
     );

     socket.on('disconnect',
     (reason) => {
     delete sockets[socket.user._id];
     }
     );
     }
     );*/
}