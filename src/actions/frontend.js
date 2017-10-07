export const SWITCH_CLICK = 0
export const NEW_CLICK = 1
export const SWAP_CLICK = 2
export const CHAT_SELECT = 3
export const INVITE_CLICK = 4
export const INVITE_ACCEPT_CLICK = 5
export const USER_SELECT = 6
export const SEND_CLICK = 7
export const CREATE_CLICK = 8
export const SIGN_IN_CLICK = 9
export const SIGN_UP_CLICK = 10
export const LOAD_MORE_CLICK = 11
export const CLEAR_ERROR = 12
export const SEARCH_CHANGE = 13
export const MARK_READ = 14
export const SORT_CHATS_LIST = 15
export const MESSAGE_INPUT_IS_EMPTY = 16
export const MESSAGE_INPUT_IS_NOT_EMPTY = 17
export const MESSAGE_SELECT = 18
export const DELETE_MESSAGES_CLICK = 19
export const SWITCH_MESSAGES_AND_CHAT_INFO = 20
export const REMOVE_USER_CLICK = 21
export const LEAVE_CHAT_CLICK = 22
export const DELETE_CHAT_CLICK = 23
export const EXIT_CLICK = 24

export const switchClick = () => ({
    type: SWITCH_CLICK
})

export const newClick = () => ({
    type: NEW_CLICK
})

export const swapClick = () => ({
    type: SWAP_CLICK
})

export const chatSelect = chatId => ({
    type: CHAT_SELECT,
    chatId
})

export const inviteClick = () => ({
    type: INVITE_CLICK
})

export const inviteAcceptClick = () => ({
    type: INVITE_ACCEPT_CLICK
})

export const userSelect = userId => ({
    type: USER_SELECT,
    userId
})

export const sendClick = message => ({
    type: SEND_CLICK,
    message
})

export const createClick = (name, desc, avatar) => ({
    type: CREATE_CLICK,
    name, desc, avatar
})

export const signInClick = (username, password) => ({
    type: SIGN_IN_CLICK,
    username, password
})

export const signUpClick = (name, surname, username, password, avatar, desc) => ({
    type: SIGN_UP_CLICK,
    name, surname, username, password, avatar, desc
})

export const loadMoreClick = () => ({
    type: LOAD_MORE_CLICK
})

export const clearError = () => ({
    type: CLEAR_ERROR
})

export const searchChange = search => ({
    type: SEARCH_CHANGE,
    search
})

export const markRead = () => ({
    type: MARK_READ
})

export const sortChatsList = chatsList => ({
    type: SORT_CHATS_LIST,
    chatsList
})

export const messageInputIsEmpty = chatId => ({
    type: MESSAGE_INPUT_IS_EMPTY,
    chatId
})

export const messageInputIsNotEmpty = chatId => ({
    type: MESSAGE_INPUT_IS_NOT_EMPTY,
    chatId
})

export const messageSelect = messageId => ({
    type: MESSAGE_SELECT,
    messageId
})

export const deleteMessagesClick = () => ({
    type: DELETE_MESSAGES_CLICK
})

export const switchMessagesAndChatInfo = () => ({
    type: SWITCH_MESSAGES_AND_CHAT_INFO
})

export const removeUserClick = userId => ({
    type: REMOVE_USER_CLICK,
    userId
})

export const leaveChatClick = () => ({
    type: LEAVE_CHAT_CLICK
})

export const deleteChatClick = () => ({
    type: DELETE_CHAT_CLICK
})

export const exitClick = () => ({
    type: EXIT_CLICK
})