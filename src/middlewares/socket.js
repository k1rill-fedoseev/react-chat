import {
    CHANGE_CHAT_INFO_CLICK, CHANGE_USER_INFO_CLICK,
    CREATE_CLICK, DELETE_CHAT_CLICK, DELETE_MESSAGES_CLICK, EXIT_CLICK, INVITE_ACCEPT_CLICK, LEAVE_CHAT_CLICK,
    LOAD_MORE_CLICK, MARK_READ,
    MESSAGE_INPUT_IS_EMPTY,
    MESSAGE_INPUT_IS_NOT_EMPTY, REMOVE_USER_CLICK,
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
    fetchMessages, fetchUsers, leaveChat, removeUser, startTyping, tryCreate1To1, tryCreateRoom,
    tryInviteUsers,
    tryMarkRead,
    trySearchUsers, trySend,
    trySignIn,
    trySignUp, updateChatInfo, updateUserInfo
} from '../actions/requests'
import {
    FETCH_CHAT_SUCCESS,
    FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE, SEARCH_USERS_SUCCESS, SIGN_IN_SUCCESS,
    SIGN_UP_SUCCESS, START_TYPING_RESPONSE
} from '../actions/responses'

export default store => next => action => {
    const state = store.getState()
    let userIds = []
    const unique = {}
    let keys

    switch (action.type) {
        case INVITE_ACCEPT_CLICK:
            socket.send(tryInviteUsers(state.ui.selectedChat, Object.keys(state.ui.selectedUsers)))
            break
        case SEND_CLICK:
            socket.send(trySend(state.ui.tempId, state.ui.selectedChat, action.message))
            break
        case CREATE_CLICK:
            if (state.ui.isRoomCreateTab)
                socket.send(tryCreateRoom(action.name, action.description, action.avatar, Object.keys(state.ui.selectedUsers)))
            else
                socket.send(tryCreate1To1(Object.keys(state.ui.selectedUsers)[0]))
            break
        case SIGN_IN_CLICK:
            socket.send(trySignIn(action.username, action.password))
            break
        case SIGN_UP_CLICK:
            console.log(action)
            socket.send(trySignUp(action.name, action.surname, action.username,
                action.password, action.avatar, action.description))
            break
        case LOAD_MORE_CLICK:
            socket.send(fetchMessages(state.ui.selectedChat, state.ui.messagesLists[state.ui.selectedChat][0]))
            break
        case SEARCH_CHANGE:
            socket.send(trySearchUsers(action.search))
            break
        case NEW_MESSAGE:
            if (!state.db.chats[action.chatId])
                socket.send(fetchChat(action.chatId))
            else if (state.ui.selectedChat === action.chatId)
                socket.send(tryMarkRead(action.chatId))

            if (action.message.from && !state.db.users[action.message.from])
                socket.send(fetchUsers([action.message.from]))
            else if (action.invitedUserId && !state.db.users[action.invitedUserId])
                socket.send(fetchUsers([action.invitedUserId]))
            break
        case MARK_READ:
            socket.send(tryMarkRead(state.ui.selectedChat))
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
            keys = Object.keys(unique)

            if (keys.length)
                socket.send(fetchUsers(keys))
            break
        case FETCH_CHAT_SUCCESS:
            if (!action.chat.isRoom)
                if (!state.db.users[action.chat.users[0]])
                    unique[action.chat.users[0]] = true
                else if (action.chat.users[1] && !state.db.users[action.chat.users[1]])
                    unique[action.chat.users[1]] = true
            break
        case FETCH_MESSAGES_SUCCESS:
            action.messages.forEach(message => {
                if (message.from && !state.db.users[message.from])
                    unique[message.from] = true
            })
            keys = Object.keys(unique)

            if (keys.length)
                socket.send(fetchUsers(keys))
            break
        case MESSAGE_INPUT_IS_NOT_EMPTY:
            socket.send(startTyping(action.chatId))
            break
        case MESSAGE_INPUT_IS_EMPTY:
            socket.send(endTyping(action.chatId))
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

            Object.keys(state.db.chats[state.ui.selectedChat].invites).forEach(userId => {
                userId = state.db.chats[state.ui.selectedChat].invites[userId]
                if (!state.db.users[userId])
                    unique[userId] = true
            })
            keys = Object.keys(unique)

            if (keys.length)
                socket.send(fetchUsers(keys))
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
        case CHANGE_CHAT_INFO_CLICK:
            socket.send(updateChatInfo(state.ui.selectedChat, action.field, action.value))
            break
        case CHANGE_USER_INFO_CLICK:
            socket.send(updateUserInfo(action.field, action.value, action.oldPassword))
            break
        case EXIT_CLICK:
            socket.send(exitRequest(state.ui.selectedChat))
            break
    }

    next(action)
}