export const SIGN_IN = 100
export const SIGN_UP = 101
export const CREATE_ROOM = 102
export const CREATE_USER_ROOM = 103
export const SEND_MESSAGE = 104
export const SEARCH_USERS = 105
export const FETCH_USERS = 106
export const FETCH_CHATS = 107
export const FETCH_MESSAGES = 108
export const INVITE_USERS = 109
export const FETCH_CHAT = 110
export const MARK_READ = 111
export const FETCH_ONLINE_USERS = 112
export const START_TYPING = 113
export const END_TYPING = 114
export const DELETE_MESSAGES = 115
export const REMOVE_USER = 116
export const LEAVE_CHAT = 117
export const DELETE_CHAT = 118
export const UPDATE_CHAT_INFO = 119
export const UPDATE_USER_INFO = 120
export const EXIT_REQUEST = 121
export const RETURN_BACK = 122

export const signIn = (username, password) => ({
    type: SIGN_IN,
    username, password
})

export const signUp = (name, surname, username, password, avatar, description) => ({
    type: SIGN_UP,
    name, surname, username, password, avatar, description
})

export const createRoom = (name, description, avatar, userIds) => ({
    type: CREATE_ROOM,
    name, description, avatar, userIds
})

export const createUserRoom = userId => ({
    type: CREATE_USER_ROOM,
    userId
})

export const sendMessage = (tempId, chatId, message, attachments) => ({
    type: SEND_MESSAGE,
    tempId, chatId, message, attachments
})

export const searchUsers = (search, chatId) => ({
    type: SEARCH_USERS,
    search, chatId
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

export const inviteUsers = (chatId, userIds) => ({
    type: INVITE_USERS,
    chatId, userIds
})

export const fetchChat = chatId => ({
    type: FETCH_CHAT,
    chatId
})

export const markRead = chatId => ({
    type: MARK_READ,
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

export const updateUserInfo = (field, value, oldPassword) => ({
    type: UPDATE_USER_INFO,
    field, value, oldPassword
})

export const exitRequest = chatId => ({
    type: EXIT_REQUEST,
    chatId
})

export const returnBack = chatId => ({
    type: RETURN_BACK,
    chatId
})