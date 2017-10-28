const SIGN_IN = 100
const SIGN_UP = 101
const CREATE_ROOM = 102
const CREATE_USER_ROOM = 103
const SEND_MESSAGE = 104
const SEARCH_USERS = 105
const FETCH_USERS = 106
const FETCH_CHATS = 107
const FETCH_MESSAGES = 108
const INVITE_USERS = 109
const FETCH_CHAT = 110
const MARK_READ = 111
const FETCH_ONLINE_USERS = 112
const START_TYPING = 113
const END_TYPING = 114
const DELETE_MESSAGES = 115
const REMOVE_USER = 116
const LEAVE_CHAT = 117
const DELETE_CHAT = 118
const UPDATE_CHAT_INFO = 119
const UPDATE_USER_INFO = 120
const EXIT_REQUEST = 121
const RETURN_BACK = 122

const CHAT_NAME = 0
const CHAT_AVATAR = 1
const CHAT_DESCRIPTION = 2

const USER_AVATAR = 0
const USER_DESCRIPTION = 1
const USER_PASSWORD = 2

const NEW_MESSAGE = 200

const NEW_MESSAGE_WITH_INVITE = 2000
const NEW_MESSAGE_WITH_REMOVE = 2001
const NEW_MESSAGE_WITH_LEFT = 2002
const NEW_MESSAGE_WITH_INFO_UPDATE = 2003

const FETCH_CHAT_SUCCESS = 201
const SIGN_IN_SUCCESS = 202
const SIGN_UP_SUCCESS = 203
const SEND_SUCCESS = 204
const FETCH_USERS_SUCCESS = 205
const FETCH_CHATS_SUCCESS = 206
const FETCH_MESSAGES_SUCCESS = 207
const SEARCH_USERS_SUCCESS = 208
const FETCH_ONLINE_USERS_SUCCESS = 209
const START_TYPING_RESPONSE = 210
const END_TYPING_RESPONSE = 211
const DELETE_CHAT_SUCCESS = 212

const ERROR = 300

module.exports = {
    SIGN_IN,
    SIGN_UP,
    CREATE_ROOM,
    CREATE_USER_ROOM,
    SEND_MESSAGE,
    SEARCH_USERS,
    FETCH_USERS,
    FETCH_CHATS,
    FETCH_MESSAGES,
    INVITE_USERS,
    FETCH_CHAT,
    MARK_READ,
    FETCH_ONLINE_USERS,
    START_TYPING,
    END_TYPING,
    DELETE_MESSAGES,
    REMOVE_USER,
    EXIT_REQUEST,
    DELETE_CHAT,
    LEAVE_CHAT,
    UPDATE_CHAT_INFO,
    UPDATE_USER_INFO,
    RETURN_BACK,

    CHAT_NAME,
    CHAT_AVATAR,
    CHAT_DESCRIPTION,
    USER_AVATAR,
    USER_DESCRIPTION,
    USER_PASSWORD,

    newMessage: (message, chatId) => ({
        type: NEW_MESSAGE,
        message, chatId
    }),

    newMessageWithInvite: (message, chatId, userId, invitedById) => ({
        type: NEW_MESSAGE,
        subtype: NEW_MESSAGE_WITH_INVITE,
        message, chatId, userId, invitedById
    }),

    newMessageWithRemove: (message, chatId, userId) => ({
        type: NEW_MESSAGE,
        subtype: NEW_MESSAGE_WITH_REMOVE,
        message, chatId, userId
    }),

    newMessageWithLeft: (message, chatId) => ({
        type: NEW_MESSAGE,
        subtype: NEW_MESSAGE_WITH_LEFT,
        message, chatId
    }),

    newMessageWithInfoUpdate: (message, chatId, field, value) => ({
        type: NEW_MESSAGE,
        subtype: NEW_MESSAGE_WITH_INFO_UPDATE,
        message, chatId, field, value
    }),

    fetchChatSuccess: chat => ({
        type: FETCH_CHAT_SUCCESS,
        chat
    }),

    signInSuccess: (user, token) => ({
        type: SIGN_IN_SUCCESS,
        user, token
    }),

    signUpSuccess: (user, token) => ({
        type: SIGN_UP_SUCCESS,
        user, token
    }),

    fetchChatsSuccess: (chats, messages) => ({
        type: FETCH_CHATS_SUCCESS,
        chats, messages
    }),

    fetchUsersSuccess: users => ({
        type: FETCH_USERS_SUCCESS,
        users
    }),

    fetchMessagesSuccess: (chatId, messages, isFullLoaded) => ({
        type: FETCH_MESSAGES_SUCCESS,
        chatId, messages, isFullLoaded
    }),

    sendSuccess: (tempId, chatId, message) => ({
        type: SEND_SUCCESS,
        tempId, chatId, message
    }),

    searchUsersSuccess: userIds => ({
        type: SEARCH_USERS_SUCCESS,
        userIds
    }),

    fetchOnlineUsersSuccess: users => ({
        type: FETCH_ONLINE_USERS_SUCCESS,
        users
    }),

    startTypingResponse: (chatId, userId) => ({
        type: START_TYPING_RESPONSE,
        chatId, userId
    }),

    endTypingResponse: (chatId, userId) => ({
        type: END_TYPING_RESPONSE,
        chatId, userId
    }),

    deleteChatSuccess: chatId => ({
        type: DELETE_CHAT_SUCCESS,
        chatId
    }),

    error: (requestType, error) => ({
        type: ERROR,
        requestType, error
    })
}