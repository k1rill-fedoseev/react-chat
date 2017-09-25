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

export const messageInputIsEmpty = () => ({
    type: MESSAGE_INPUT_IS_EMPTY
})

export const messageInputIsNotEmpty = () => ({
    type: MESSAGE_INPUT_IS_NOT_EMPTY
})