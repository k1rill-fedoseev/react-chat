export const TRY_SIGN_IN = 100
export const TRY_SIGN_UP = 101
export const TRY_CREATE_ROOM = 102
export const TRY_CREATE_1_TO_1 = 103
export const TRY_SEND = 104
export const FETCH_USERS = 105
export const FETCH_CHATS = 106
export const FETCH_MESSAGES = 107
export const TRY_INVITE_USERS = 108
export const FETCH_CHAT = 109

export const trySignIn = (username, password) => ({
    type: TRY_SIGN_IN,
    username, password
})

export const trySignUp = (name, surname, username, password, avatar, desc) => ({
    type: TRY_SIGN_UP,
    name, surname, username, password, avatar, desc
})

export const tryCreateRoom = (name, desc, avatar, users) => ({
    type: TRY_CREATE_ROOM,
    name, desc, avatar, users
})

export const tryCreate1To1 = (user) => ({
    type: TRY_CREATE_1_TO_1,
    user
})

export const trySend = (tempId, chatId, message) => ({
    type: TRY_SEND,
    tempId, chatId, message
})

export const fetchUsers = (search) => ({
    type: FETCH_USERS,
    search
})

export const fetchChats = () => ({
    type: FETCH_CHATS
})

export const fetchMessages = (chatId, lastMessageId) => ({
    type: FETCH_MESSAGES,
    chatId, lastMessageId
})

export const tryInviteUsers = (chatId, users) => ({
    type: TRY_INVITE_USERS,
    chatId, users
})

export const fetchChat = (chatId) => ({
    type: FETCH_CHAT,
    chatId
})