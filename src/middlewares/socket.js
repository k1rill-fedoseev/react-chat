import {
    CHAT_SELECT,
    CREATE_CLICK, INVITE_ACCEPT_CLICK, LOAD_MORE_CLICK, MARK_READ, SEARCH_CHANGE, SEND_CLICK, SIGN_IN_CLICK,
    SIGN_UP_CLICK
} from '../actions/frontend'
import socket from '../sockets'
import {
    fetchChat, fetchChats,
    fetchMessages, fetchUsers, tryCreate1To1, tryCreateRoom, tryInviteUsers, tryMarkRead,
    trySearchUsers, trySend,
    trySignIn,
    trySignUp
} from '../actions/requests'
import {
    FETCH_CHAT_SUCCESS,
    FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE, SEARCH_USERS_SUCCESS, SIGN_IN_SUCCESS,
    SIGN_UP_SUCCESS
} from '../actions/responses'

export default store => next => action => {
    const state = store.getState()
    let userIds = []

    switch (action.type) {
        case INVITE_ACCEPT_CLICK:
            socket.send(tryInviteUsers(state.ui.selectedChat, state.ui.selectedUsers))
            break
        case SEND_CLICK:
            socket.send(trySend(state.ui.tempId, state.ui.selectedChat, action.message))
            break
        case CREATE_CLICK:
            if (state.ui.isRoomCreateTab)
                socket.send(tryCreateRoom(action.name, action.desc, action.avatar, state.ui.selectedUsers))
            else
                socket.send(tryCreate1To1(state.ui.selectedUsers[0]))
            break
        case SIGN_IN_CLICK:
            socket.send(trySignIn(action.username, action.password))
            break
        case SIGN_UP_CLICK:
            socket.send(trySignUp(action.name, action.surname, action.username,
                action.password, action.avatar, action.desc))
            break
        case CHAT_SELECT:
            if(state.ui.messagesLists[action.chatId].length < 2)
                socket.send(fetchMessages(action.chatId, state.ui.messagesLists[action.chatId][0]))
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
            break
        case MARK_READ:
            socket.send(tryMarkRead(state.ui.selectedChat))
            break
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            if (action.token)
                document.cookie = `token=${action.token}`
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
                if (!chat.isRoom && !state.db.users[chat.to])
                    userIds.push(chat.to)
            })
            action.messages.forEach(message => {
                if(message.from && !state.db.users[message.from])
                    userIds.push(message.from)
            })
            if (userIds.length)
                socket.send(fetchUsers(userIds))
            break
        case FETCH_CHAT_SUCCESS:
            if (!action.chat.isRoom && !state.db.users[action.chat.to])
                socket.send(fetchUsers([action.chat.to]))
            break
        case FETCH_MESSAGES_SUCCESS:
            const unique = {}

            action.messages.forEach(message => {
                if (message.from && !state.db.users[message.from])
                    unique[message.from] = true
            })
            const keys = Object.keys(unique)

            if (keys.length)
                socket.send(fetchUsers(keys))
            break
    }

    next(action)
}