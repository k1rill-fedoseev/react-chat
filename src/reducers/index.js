/*
 phase:
 0 - signIn screen
 1 - signUp screen
 2 - loggedIn, only chatList
 3 - loggedIn, chat selected
 4 - inviting Users to chat-room
 5 - creating new chat-room
 6 - creating new 1-to-1 chat
 */
import {
    CHAT_SELECT, CLEAR_ERROR, CREATE_CLICK, INVITE_ACCEPT_CLICK, INVITE_CLICK, LOAD_MORE_CLICK, NEW_CLICK,
    SEARCH_CHANGE, SEND_CLICK,
    SIGN_IN_CLICK,
    SIGN_UP_CLICK,
    SWAP_CLICK,
    SWITCH_CLICK, USER_SELECT
} from '../actions/frontend'

import {
    fetchChat,
    fetchChats,
    fetchMessages, fetchUsers, tryCreate1To1, tryCreateRoom, tryInviteUsers, trySend, trySignIn,
    trySignUp
} from '../actions/requests'
import {
    CREATE_ERROR, FETCH_CHATS_ERROR,
    FETCH_CHATS_SUCCESS, FETCH_MESSAGES_ERROR, FETCH_MESSAGES_SUCCESS, FETCH_USERS_ERROR, FETCH_USERS_SUCCESS,
    NEW_MESSAGE, SEND_ERROR,
    SEND_SUCCESS,
    SIGN_IN_ERROR,
    SIGN_IN_SUCCESS, SIGN_UP_ERROR, FETCH_CHAT_SUCCESS, FETCH_CHAT_ERROR, SIGN_UP_SUCCESS
} from '../actions/responses'

import socket from '../sockets'
//some shit with loading this module

const initialState = {
    phase: 0,
    tempId: 0,
    account: {},
    usersSelected: [],//id && username
    usersSearch: [],
    activeChat: {},
    chats: [],
    messages: {},
    error: ''
}

const compare = (state) => {
    return (a, b) =>
    state.messages[b.id][0].time - state.messages[a.id][0].time
}

export default (state = initialState, action) => {
    const nextState = {...state}
    nextState.usersSelected = [...state.usersSelected]
    nextState.usersSearch = [...state.usersSearch]
    nextState.chats = [...state.chats]
    for (let chat of nextState.chats)
        if (chat.id === nextState.activeChat.id)
            nextState.activeChat = chat
    nextState.messages = {...state.messages}

    const activeId = nextState.activeChat.id
    switch (action.type) {
        case SWITCH_CLICK:
            if (nextState.phase < 2) {
                nextState.phase = 1 - nextState.phase
            }
            break
        case NEW_CLICK:
            if (nextState.phase < 5)
                nextState.phase = 5
            else
                nextState.phase = activeId ? 3 : 2
            nextState.usersSelected = []
            break
        case SWAP_CLICK:
            if (nextState.phase > 4) {
                nextState.phase = 11 - nextState.phase
                nextState.usersSelected = []
            }
            break
        case CHAT_SELECT:
            for (let chat of nextState.chats) {
                if (chat.id === action.id) {
                    nextState.activeChat = chat
                    break
                }
            }
            nextState.phase = 3
            break
        case INVITE_CLICK:
            if (nextState.phase === 3 || nextState.phase === 4) {
                nextState.phase = 7 - nextState.phase
            }
            break
        case INVITE_ACCEPT_CLICK:
            socket.send(tryInviteUsers(activeId, nextState.usersSelected.map(user => user.id)))
            nextState.usersSelected = []
            nextState.phase = 3
            break
        case USER_SELECT:
            if (nextState.usersSelected.some(user => user.id === action.id))
                nextState.usersSelected = nextState.usersSelected.filter(user => user.id !== action.id)
            else if (nextState.phase === 6)
                nextState.usersSelected = [{
                    id: action.id,
                    username: action.username
                }]
            else
                nextState.usersSelected.push({
                    id: action.id,
                    username: action.username
                })
            break
        case SEND_CLICK:
            nextState.messages[activeId].unshift({
                message: action.message,
                me: true,
                time: Date.now(),
                id: 'temp' + nextState.tempId,
                avatar: nextState.account.avatar,
                tempId: nextState.tempId
            })
            nextState.messages[activeId] = [...nextState.messages[activeId]]
            nextState.chats.sort(compare(nextState))
            socket.send(trySend(nextState.tempId++, activeId, action.message))
            break
        case CREATE_CLICK:
            if (nextState.phase === 5) {
                socket.send(tryCreateRoom(action.name, action.desc, action.avatar,
                    nextState.usersSelected.map(user => user.id)))
                nextState.phase = activeId ? 3 : 2
            }
            else if (nextState.usersSelected.length === 1) {
                socket.send(tryCreate1To1(nextState.usersSelected[0].id))
                nextState.phase = activeId ? 3 : 2
            }
            break
        case SIGN_IN_CLICK:
            socket.send(trySignIn(action.username, action.password))
            break
        case SIGN_UP_CLICK:
            socket.send(trySignUp(action.name, action.surname, action.username, action.password, action.avatar, action.desc))
            break
        case LOAD_MORE_CLICK:
            if (!nextState.activeChat.isLoading) {
                nextState.activeChat.isLoading = true
                socket.send(fetchMessages(activeId, nextState.messages[activeId][nextState.messages[activeId].length - 1].id))
            }
            break
        case CLEAR_ERROR:
            nextState.error = ''
            break
        case SEARCH_CHANGE:
            socket.send(fetchUsers(action.search))
            break

        //responses

        case NEW_MESSAGE:
            if (!nextState.messages[action.chatId])
                nextState.messages[action.chatId] = []
            nextState.messages[action.chatId].unshift(action.message)
            nextState.messages[action.chatId] = [...nextState.messages[action.chatId]]

            if (!nextState.chats.some((chat => chat.id === action.chatId))) {
                nextState.messages[action.chatId][0].isStart = true
                socket.send(fetchChat(action.chatId))
            }
            nextState.chats.sort(compare(nextState))
            break
        case FETCH_CHAT_SUCCESS:
            nextState.chats.push(action.chat)
            nextState.chats.sort(compare(nextState))
            break
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            nextState.account = action.account
            nextState.phase = 2
            if (action.token)
                document.cookie = 'token=' + action.token
            socket.send(fetchChats())
            break
        case SEND_SUCCESS:
            const messages = nextState.messages[action.chatId]
            for (let i = messages.length - 1; i >= 0; --i) {
                if (messages[i].tempId === action.tempId) {
                    messages[i] = action.message
                    break
                }
            }
            nextState.messages[action.chatId] = [...nextState.messages[action.chatId]]
            nextState.chats.sort(compare(nextState))
            break
        case FETCH_USERS_SUCCESS:
            nextState.usersSearch = action.users
            break
        case FETCH_CHATS_SUCCESS:
            nextState.chats = action.chats
            nextState.messages = action.messages
            nextState.chats.sort(compare(nextState))
            break
        case FETCH_MESSAGES_SUCCESS:
            for (let i = 0; i < nextState.chats.length; ++i) {
                if (nextState.chats[i].id === action.chatId) {
                    nextState.chats[i].isLoading = false
                    break
                }
            }
            nextState.messages[action.chatId].push(...action.messages)
            nextState.messages[action.chatId] = [...nextState.messages[action.chatId]]
            break

        case SIGN_IN_ERROR:
        case SIGN_UP_ERROR:
        case CREATE_ERROR:
        case SEND_ERROR:
        case FETCH_USERS_ERROR:
        case FETCH_CHATS_ERROR:
        case FETCH_CHAT_ERROR:
        case FETCH_MESSAGES_ERROR:
            console.log(`[${Date.now()}] ERROR ${action.type} : ${action.error}`)
            nextState.error = 'ERROR ' + action.type + ': ' + action.error
            break
    }

    return nextState
}