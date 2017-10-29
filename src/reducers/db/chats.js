import {
    DELETE_CHAT_SUCCESS, FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS,
    NEW_MESSAGE, NEW_MESSAGE_WITH_INFO_UPDATE, NEW_MESSAGE_WITH_INVITE, NEW_MESSAGE_WITH_LEFT, NEW_MESSAGE_WITH_REMOVE
} from '../../actions/responses'
import {
    CHAT_AVATAR, CHAT_DESCRIPTION, CHAT_NAME, EXIT_CLICK, LOAD_MORE_CLICK,
    MARK_READ_FRONTEND
} from '../../actions/frontend'

export default (state = {}, action) => {
    let newState

    switch (action.type) {
        case FETCH_CHATS_SUCCESS:
            newState = {}

            action.chats.forEach(chat => {
                const invites = {}

                if (chat.invites) {
                    chat.invites.forEach((invite, index) => {
                        if (invite)
                            invites[chat.users[index]] = invite
                    })
                    chat.invites = invites
                }

                newState[chat.id] = chat
                newState[chat.id].isMember = chat.users.includes(action.loggedAccount)
                if (!chat.isRoom) {
                    newState[chat.id].to = chat.users[0]
                    if (action.loggedAccount === chat.users[0] && chat.users.length > 1)
                        newState[chat.id].to = chat.users[1]
                }
            })

            return newState
        case FETCH_CHAT_SUCCESS:
            const {chat} = action
            const invites = {}

            newState = {...state}

            if (chat.invites)
                chat.invites.forEach((invite, index) => {
                    if (invite)
                        invites[chat.users[index]] = invite
                })

            newState[chat.id] = {
                ...chat,
                invites,
                isMember: chat.users.includes(action.loggedAccount)
            }

            if (!chat.isRoom) {
                newState[chat.id].to = chat.users[0]
                if (action.loggedAccount === chat.users[0] && chat.users.length > 1)
                    newState[chat.id].to = chat.users[1]
            }

            if(state[chat.id])
                newState[chat.id].newMessages = state[chat.id].newMessages

            return newState
        case FETCH_MESSAGES_SUCCESS:
            if (!action.isFullLoaded)
                return {
                    ...state,
                    [action.chatId]: {
                        ...state[action.chatId],
                        isLoading: false
                    }
                }

            return {
                ...state,
                [action.chatId]: {
                    ...state[action.chatId],
                    isFullLoaded: true
                }
            }
        case NEW_MESSAGE:
            if ((!action.subtype && action.selectedChat === action.chatId) || !state[action.chatId])
                return state

            newState = {
                ...state,
                [action.chatId]: {
                    ...state[action.chatId],
                    newMessages: action.selectedChat === action.chatId
                        ? 0
                        : state[action.chatId].newMessages + 1
                }
            }

            switch (action.subtype) {
                case NEW_MESSAGE_WITH_INVITE:
                    if (action.loggedAccount === action.userId) {
                        newState[action.chatId].isMember = true
                        newState[action.chatId].hasLeft = false
                    }

                    newState[action.chatId].users = [
                        ...newState[action.chatId].users,
                        action.userId
                    ]
                    newState[action.chatId].invites = {
                        ...newState[action.chatId].invites,
                        [action.userId]: action.invitedById
                    }
                    break
                case NEW_MESSAGE_WITH_REMOVE:
                    if (action.loggedAccount === action.userId)
                        newState[action.chatId].isMember = false

                    newState[action.chatId].users = newState[action.chatId].users
                        .filter(userId => userId !== action.userId)

                    newState[action.chatId].invites = {
                        ...newState[action.chatId].invites,
                    }
                    delete newState[action.chatId].invites[action.userId]
                    break
                case NEW_MESSAGE_WITH_LEFT:
                    newState[action.chatId].isMember = false
                    newState[action.chatId].hasLeft = true

                    newState[action.chatId].users = newState[action.chatId].users
                        .filter(userId => userId !== action.loggedAccount)

                    newState[action.chatId].invites = {
                        ...newState[action.chatId].invites,
                    }
                    delete newState[action.chatId].invites[action.loggedAccount]
                    break
                case NEW_MESSAGE_WITH_INFO_UPDATE:
                    switch (action.field) {
                        case CHAT_NAME:
                            newState[action.chatId].name = action.value
                            break
                        case CHAT_AVATAR:
                            newState[action.chatId].avatar = action.value
                            break
                        case CHAT_DESCRIPTION:
                            newState[action.chatId].description = action.value
                            break
                    }
                    break
            }

            return newState
        case MARK_READ_FRONTEND:
            return {
                ...state,
                [action.selectedChat]: {
                    ...state[action.selectedChat],
                    newMessages: 0
                }
            }
        case LOAD_MORE_CLICK:
            return {
                ...state,
                [action.selectedChat]: {
                    ...state[action.selectedChat],
                    isLoading: true
                }
            }
        case DELETE_CHAT_SUCCESS:
            newState = {...state}
            delete newState[action.chatId]

            return newState
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}