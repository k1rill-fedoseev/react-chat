export const TRY_SIGN_IN = 100
export const TRY_SIGN_UP = 101
export const TRY_CREATE_ROOM = 102
export const TRY_CREATE_1_TO_1 = 103
export const TRY_SEND = 104
export const TRY_SEARCH_USERS = 105
export const FETCH_USERS = 106
export const FETCH_CHATS = 107
export const FETCH_MESSAGES = 108
export const TRY_INVITE_USERS = 109
export const FETCH_CHAT = 110
export const TRY_MARK_READ = 111
export const FETCH_ONLINE_USERS = 112
export const START_TYPING = 113
export const END_TYPING = 114
export const DELETE_MESSAGES = 115
export const REMOVE_USER = 116
export const LEAVE_CHAT = 117
export const DELETE_CHAT = 118
export const UPDATE_CHAT_INFO = 119
export const EXIT_REQUEST = 120

export const trySignIn = (username, password) => ({
    type: TRY_SIGN_IN,
    username, password
})

export const trySignUp = (name, surname, username, password, avatar, desc) => ({
    type: TRY_SIGN_UP,
    name, surname, username, password, avatar, desc
})

export const tryCreateRoom = (name, desc, avatar, userIds) => ({
    type: TRY_CREATE_ROOM,
    name, desc, avatar, userIds
})

export const tryCreate1To1 = userId => ({
    type: TRY_CREATE_1_TO_1,
    userId
})

export const trySend = (tempId, chatId, message) => ({
    type: TRY_SEND,
    tempId, chatId, message
})

export const trySearchUsers = search => ({
    type: TRY_SEARCH_USERS,
    search
})

export const fetchUsers = userIds => ({
    type: FETCH_USERS,
    userIds
})

export const fetchChats = () => ({
    type: FETCH_CHATS
})

export const fetchMessages = (chatId, lastMessageId) => ({
    type: FETCH_MESSAGES,
    chatId, lastMessageId
})

export const tryInviteUsers = (chatId, userIds) => ({
    type: TRY_INVITE_USERS,
    chatId, userIds
})

export const fetchChat = chatId => ({
    type: FETCH_CHAT,
    chatId
})

export const tryMarkRead = chatId => ({
    type: TRY_MARK_READ,
    chatId
})

export const fetchOnlineUsers = userIds => ({
    type: FETCH_ONLINE_USERS,
    userIds
})

export const startTyping = chatId => ({
    type: START_TYPING,
    chatId
})

export const endTyping = chatId => ({
    type: END_TYPING,
    chatId
})

export const deleteMessages = messageIds => ({
    type: DELETE_MESSAGES,
    messageIds
})

export const removeUser = (chatId, userId) => ({
    type: REMOVE_USER,
    chatId, userId
})

export const leaveChat = chatId => ({
    type: LEAVE_CHAT,
    chatId
})

export const deleteChat = chatId => ({
    type: DELETE_CHAT,
    chatId
})

export const updateChatInfo = (chatId, field, value) => ({
    type: UPDATE_CHAT_INFO,
    chatId, field, value
})

export const exitRequest = chatId => ({
    type: EXIT_REQUEST,
    chatId
})