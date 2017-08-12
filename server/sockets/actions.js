const TRY_SIGN_IN = 100
const TRY_SIGN_UP = 101
const TRY_CREATE_ROOM = 102
const TRY_CREATE_1_TO_1 = 103
const TRY_SEND = 104
const FETCH_USERS = 105
const FETCH_CHATS = 106
const FETCH_MESSAGES = 107
const TRY_INVITE_USERS = 108
const FETCH_CHAT = 109
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

module.exports = {
    TRY_SIGN_IN,
    TRY_SIGN_UP,
    TRY_CREATE_ROOM,
    TRY_CREATE_1_TO_1,
    TRY_SEND,
    FETCH_USERS,
    FETCH_CHATS,
    FETCH_MESSAGES,
    TRY_INVITE_USERS,
    FETCH_CHAT,

    NEW_MESSAGE,
    FETCH_CHAT_SUCCESS,
    FETCH_CHAT_ERROR,
    SIGN_IN_SUCCESS,
    SIGN_IN_ERROR,
    SIGN_UP_SUCCESS,
    SIGN_UP_ERROR,
    CREATE_SUCCESS,
    CREATE_ERROR,
    SEND_SUCCESS,
    SEND_ERROR,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_ERROR,
    FETCH_CHATS_SUCCESS,
    FETCH_CHATS_ERROR,
    FETCH_MESSAGES_SUCCESS,
    FETCH_MESSAGES_ERROR,
    INVITE_USERS_SUCCESS,
    INVITE_USERS_ERROR,

    newMessage: (message, chatId) => ({
        type: NEW_MESSAGE,
        message, chatId
    }),

    fetchChatSuccess: (chat) => ({
        type: FETCH_CHAT_SUCCESS,
        chat
    }),

    fetchChatError: (error) => ({
        type: FETCH_CHAT_ERROR,
        error
    }),

    signInSuccess: (name, surname, avatar, token) => ({
        type: SIGN_IN_SUCCESS,
        account: {name, surname, avatar},
        token
    }),

    signInError: (error) => ({
        type: SIGN_IN_ERROR,
        error
    }),

    signUpSuccess: (name, surname, avatar, token) => ({
        type: SIGN_UP_SUCCESS,
        account: {name, surname, avatar},
        token
    }),

    signUpError: (error) => ({
        type: SIGN_UP_ERROR,
        error
    }),

    createError: (error) => ({
        type: CREATE_ERROR,
        error
    }),

    fetchChatsSuccess: (chats, messages) => ({
        type: FETCH_CHATS_SUCCESS,
        chats, messages
    }),

    fetchChatsError: (error) => ({
        type: FETCH_CHATS_ERROR,
        error
    }),

    fetchUsersSuccess: (users) => ({
        type: FETCH_USERS_SUCCESS,
        users
    }),

    fetchUsersError: (error) => ({
        type: FETCH_USERS_ERROR,
        error
    }),

    fetchMessagesSuccess: (chatId, messages) => ({
        type: FETCH_MESSAGES_SUCCESS,
        chatId, messages
    }),

    fetchMessagesError: (error) => ({
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

    inviteUsersError: (error) => ({
        type: INVITE_USERS_ERROR,
        error
    })
}