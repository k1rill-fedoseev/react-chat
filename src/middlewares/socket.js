import {
    CHANGE_CHAT_INFO_CLICK, CHANGE_USER_INFO_CLICK, CHAT_SELECT,
    CREATE_CLICK, DELETE_CHAT_CLICK, DELETE_MESSAGES_CLICK, EXIT_CLICK, INVITE_ACCEPT_CLICK, LEAVE_CHAT_CLICK,
    LOAD_MORE_CLICK, MARK_READ_FRONTEND, MESSAGE_INPUT_CHANGE, REMOVE_USER_CLICK, RETURN_BACK_CLICK,
    SEARCH_CHANGE,
    SEND_CLICK, SIGN_IN_CLICK,
    SIGN_UP_CLICK, SWITCH_MESSAGES_AND_CHAT_INFO
} from '../actions/frontend'
import socket from '../sockets'
import {
    deleteChat,
    deleteMessages,
    endTyping, exitRequest,
    fetchChat, fetchChats,
    fetchMessages, fetchUsers, leaveChat, removeUser, startTyping, createUserRoom, createRoom,
    inviteUsers,
    markRead,
    searchUsers, sendMessage,
    signIn,
    signUp, updateChatInfo, updateUserInfo, returnBack
} from '../actions/requests'
import {
    FETCH_CHAT_SUCCESS,
    FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE, NEW_MESSAGE_WITH_INVITE, SEARCH_USERS_SUCCESS,
    SIGN_IN_SUCCESS,
    SIGN_UP_SUCCESS, START_TYPING_RESPONSE
} from '../actions/responses'

export default store => next => action => {
    const state = store.getState()
    let userIds = []
    const unique = {}

    switch (action.type) {
        case INVITE_ACCEPT_CLICK:
            socket.send(inviteUsers(state.ui.selectedChat, Object.keys(state.ui.selectedUsers)))
            break
        case SEND_CLICK:
            socket.send(sendMessage(state.ui.tempId, state.ui.selectedChat, action.message, action.attachments))
            socket.send(endTyping(state.ui.selectedChat))
            break
        case CREATE_CLICK:
            if (state.ui.isRoomCreateTab)
                socket.send(createRoom(action.name, action.description, action.avatar, Object.keys(state.ui.selectedUsers)))
            else
                socket.send(createUserRoom(Object.keys(state.ui.selectedUsers)[0]))
            break
        case SIGN_IN_CLICK:
            socket.send(signIn(action.username, action.password))
            break
        case SIGN_UP_CLICK:
            socket.send(signUp(action.name, action.surname, action.username,
                action.password, action.avatar, action.description))
            break
        case LOAD_MORE_CLICK:
            socket.send(fetchMessages(state.ui.selectedChat, state.ui.messagesLists[state.ui.selectedChat][0]))
            break
        case SEARCH_CHANGE:
            socket.send(searchUsers(action.search, state.ui.newChatTab
                ? ''
                : state.ui.selectedChat))
            break
        case NEW_MESSAGE:
            if (!state.db.chats[action.chatId])
                socket.send(fetchChat(action.chatId))
            else {
                if (action.subtype === NEW_MESSAGE_WITH_INVITE && state.ui.loggedAccount === action.userId)
                    socket.send(fetchChat(action.chatId))

                if (state.ui.selectedChat === action.chatId)
                    socket.send(markRead(action.chatId))
            }

            if (action.message.from && !state.db.users[action.message.from])
                socket.send(fetchUsers([action.message.from]))
            else if (action.subtype === NEW_MESSAGE_WITH_INVITE && !state.db.users[action.userId])
                socket.send(fetchUsers([action.userId]))
            break
        case MARK_READ_FRONTEND:
            socket.send(markRead(state.ui.selectedChat))
            break
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            socket.send(fetchChats())
            break
        case SEARCH_USERS_SUCCESS:
            userIds = action.userIds.filter(
                userId => !state.db.users[userId]
            )
            if (userIds.length)
                socket.send(fetchUsers(userIds))
            break
        case FETCH_CHATS_SUCCESS:
            action.chats.forEach(chat => {
                if (!chat.isRoom) {
                    if (!state.db.users[chat.users[0]])
                        unique[chat.users[0]] = true
                    else if (chat.users[1] && !state.db.users[chat.users[1]])
                        unique[chat.users[1]] = true
                }
            })
            action.messages.forEach(message => {
                if (message.from && !state.db.users[message.from])
                    unique[message.from] = true
            })
            userIds = Object.keys(unique)

            if (userIds.length)
                socket.send(fetchUsers(userIds))
            break
        case FETCH_CHAT_SUCCESS:
            if (!action.chat.isRoom)
                if (!state.db.users[action.chat.users[0]])
                    socket.send(fetchUsers([action.chat.users[0]]))
                else if (action.chat.users[1] && !state.db.users[action.chat.users[1]])
                    socket.send(fetchUsers([action.chat.users[1]]))
            break
        case FETCH_MESSAGES_SUCCESS:
            action.messages.forEach(message => {
                if (message.from && !state.db.users[message.from])
                    unique[message.from] = true
            })
            userIds = Object.keys(unique)

            if (userIds.length)
                socket.send(fetchUsers(userIds))
            break
        case MESSAGE_INPUT_CHANGE:
            if (!state.ui.messagesInputs[state.ui.selectedChat] && action.value && state.db.chats[state.ui.selectedChat].isMember)
                socket.send(startTyping(state.ui.selectedChat))
            else if (state.ui.messagesInputs[state.ui.selectedChat] && !action.value && state.db.chats[state.ui.selectedChat].isMember)
                socket.send(endTyping(state.ui.selectedChat))
            break
        case CHAT_SELECT:
            if (state.ui.messagesInputs[state.ui.selectedChat] && state.db.chats[state.ui.selectedChat].isMember)
                socket.send(endTyping(state.ui.selectedChat))
            if (state.ui.messagesInputs[action.chatId] && state.db.chats[action.chatId].isMember)
                socket.send(startTyping(action.chatId))
            break
        case DELETE_MESSAGES_CLICK:
            socket.send(deleteMessages(Object.keys(state.ui.selectedMessages)))
            break
        case START_TYPING_RESPONSE:
            if (!state.db.users[action.userId])
                socket.send(fetchUsers([action.userId]))
            break
        case SWITCH_MESSAGES_AND_CHAT_INFO:
            state.db.chats[state.ui.selectedChat].users.forEach(userId => {
                if (!state.db.users[userId])
                    unique[userId] = true
            })

            const invites = state.db.chats[state.ui.selectedChat].invites

            if (invites) {
                Object.keys(invites).forEach(key => {
                    if(invites[key]) {
                        const userId = invites[key]

                        if (!state.db.users[userId])
                            unique[userId] = true
                    }
                })
                userIds = Object.keys(unique)

                if (userIds.length)
                    socket.send(fetchUsers(userIds))
            }
            break
        case REMOVE_USER_CLICK:
            socket.send(removeUser(state.ui.selectedChat, action.userId))
            break
        case LEAVE_CHAT_CLICK:
            socket.send(leaveChat(state.ui.selectedChat))
            break
        case DELETE_CHAT_CLICK:
            socket.send(deleteChat(state.ui.selectedChat))
            break
        case RETURN_BACK_CLICK:
            socket.send(returnBack(state.ui.selectedChat))
            break
        case CHANGE_CHAT_INFO_CLICK:
            socket.send(updateChatInfo(state.ui.selectedChat, action.field, action.value))
            break
        case CHANGE_USER_INFO_CLICK:
            socket.send(updateUserInfo(action.field, action.value, action.oldPassword))
            break
        case EXIT_CLICK:
            const chat = state.db.chats[state.ui.selectedChat] || false
            socket.send(exitRequest(chat.isMember
                ? chat.id
                : ''))
            break
    }

    next(action)
}