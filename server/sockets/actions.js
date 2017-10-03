const TRY_SIGN_IN = 100
const TRY_SIGN_UP = 101
const TRY_CREATE_ROOM = 102
const TRY_CREATE_1_TO_1 = 103
const TRY_SEND = 104
const TRY_SEARCH_USERS = 105
const FETCH_USERS = 106
const FETCH_CHATS = 107
const FETCH_MESSAGES = 108
const TRY_INVITE_USERS = 109
const FETCH_CHAT = 110
const TRY_MARK_READ = 111
const FETCH_ONLINE_USERS = 112
const START_TYPING = 113
const END_TYPING = 114
const DELETE_MESSAGES = 115
const REMOVE_USER = 116
const LEAVE_CHAT = 117
const EXIT_REQUEST = 118

const NEW_MESSAGE = 200
const FETCH_CHAT_SUCCESS = 201
const FETCH_CHAT_ERROR = 202
const SIGN_IN_SUCCESS = 203
const SIGN_IN_ERROR = 204
const SIGN_UP_SUCCESS = 205
const SIGN_UP_ERROR = 206
const CREATE_SUCCESS = 207
const CREATE_ERROR = 208
const SEND_SUCCESS = 209
const SEND_ERROR = 210
const FETCH_USERS_SUCCESS = 211
const FETCH_USERS_ERROR = 212
const FETCH_CHATS_SUCCESS = 213
const FETCH_CHATS_ERROR = 214
const FETCH_MESSAGES_SUCCESS = 215
const FETCH_MESSAGES_ERROR = 216
const INVITE_USERS_SUCCESS = 217
const INVITE_USERS_ERROR = 218
const SEARCH_USERS_SUCCESS = 219
const SEARCH_USERS_ERROR = 220
const FETCH_ONLINE_USERS_SUCCESS = 221
const FETCH_ONLINE_USERS_ERROR = 222
const START_TYPING_RESPONSE = 223
const END_TYPING_RESPONSE = 224

module.exports = {
    TRY_SIGN_IN,
    TRY_SIGN_UP,
    TRY_CREATE_ROOM,
    TRY_CREATE_1_TO_1,
    TRY_SEND,
    TRY_SEARCH_USERS,
    FETCH_USERS,
    FETCH_CHATS,
    FETCH_MESSAGES,
    TRY_INVITE_USERS,
    FETCH_CHAT,
    TRY_MARK_READ,
    FETCH_ONLINE_USERS,
    START_TYPING,
    END_TYPING,
    DELETE_MESSAGES,
    REMOVE_USER,
    EXIT_REQUEST,
    LEAVE_CHAT,

    newMessage: (message, chatId) => ({
        type: NEW_MESSAGE,
        message, chatId
    }),

    newMessageWithInvite: (message, chatId, invitedUserId, invitedById) => ({
        type: NEW_MESSAGE,
        message, chatId, invitedUserId, invitedById
    }),

    newMessageWithRemove: (message, chatId, removedUserId) => ({
        type: NEW_MESSAGE,
        message, chatId, removedUserId
    }),

    fetchChatSuccess: chat => ({
        type: FETCH_CHAT_SUCCESS,
        chat
    }),

    fetchChatError: error => ({
        type: FETCH_CHAT_ERROR,
        error
    }),

    signInSuccess: (user, token) => ({
        type: SIGN_IN_SUCCESS,
        account: user,
        token
    }),

    signInError: error => ({
        type: SIGN_IN_ERROR,
        error
    }),

    signUpSuccess: (user, token) => ({
        type: SIGN_UP_SUCCESS,
        account: user,
        token
    }),

    signUpError: error => ({
        type: SIGN_UP_ERROR,
        error
    }),

    createError: error => ({
        type: CREATE_ERROR,
        error
    }),

    fetchChatsSuccess: (chats, messages) => ({
        type: FETCH_CHATS_SUCCESS,
        chats, messages
    }),

    fetchChatsError: error => ({
        type: FETCH_CHATS_ERROR,
        error
    }),

    fetchUsersSuccess: users => ({
        type: FETCH_USERS_SUCCESS,
        users
    }),

    fetchUsersError: error => ({
        type: FETCH_USERS_ERROR,
        error
    }),

    fetchMessagesSuccess: (chatId, messages, isFullLoaded) => ({
        type: FETCH_MESSAGES_SUCCESS,
        chatId, messages, isFullLoaded
    }),

    fetchMessagesError: error => ({
        type: FETCH_MESSAGES_ERROR,
        error
    }),

    sendSuccess: (tempId, chatId, message) => ({
        type: SEND_SUCCESS,
        tempId, chatId, message
    }),

    sendError: (error, tempId) => ({
        type: SEND_ERROR,
        error, tempId
    }),

    inviteUsersError: error => ({
        type: INVITE_USERS_ERROR,
        error
    }),

    searchUsersSuccess: userIds => ({
        type: SEARCH_USERS_SUCCESS,
        userIds
    }),

    searchUsersError: error => ({
        type: SEARCH_USERS_ERROR,
        error
    }),

    fetchOnlineUsersSuccess: users => ({
        type: FETCH_ONLINE_USERS_SUCCESS,
        users
    }),

    fetchOnlineUsersError: error => ({
        type: FETCH_ONLINE_USERS_ERROR,
        error
    }),

    startTypingResponse: (chatId, userId) => ({
        type: START_TYPING_RESPONSE,
        chatId, userId
    }),

    endTypingResponse: (chatId, userId) => ({
        type: END_TYPING_RESPONSE,
        chatId, userId
    })
}