import {
    DELETE_CHAT_SUCCESS, FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS,
    NEW_MESSAGE
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

                if(chat.invites) {
                    chat.invites.forEach((invite, index) => {
                        if (invite)
                            invites[chat.users[index]] = invite
                    })
                    chat.invites = invites
                }

                newState[chat.id] = chat
                newState[chat.id].isMember = chat.users.includes(action.userId)
                if(!chat.isRoom) {
                    newState[chat.id].to = chat.users[0]
                    if(action.userId === chat.users[0] && chat.users.length > 1)
                        newState[chat.id].to = chat.users[1]
                }
            })

            return newState
        case FETCH_CHAT_SUCCESS:
            const {chat} = action
            const invites = {}

            newState = {...state}

            if(chat.invites)
                chat.invites.forEach((invite, index) => {
                    if (invite)
                        invites[chat.users[index]] = invite
                })

            newState[chat.id] = {
                ...chat,
                invites,
                isMember: chat.users.includes(action.userId)
            }

            if(!chat.isRoom) {
                newState[chat.id].to = chat.users[0]
                if(action.userId === chat.users[0] && chat.users.length > 1)
                    newState[chat.id].to = chat.users[1]
            }

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
            if ((!action.invitedUserId && !action.removedUserId && action.changedField === undefined && action.selectedChat === action.chatId) || !state[action.chatId])
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

            if (action.invitedUserId) {
                if (action.invitedUserId === action.userId)
                    newState[action.chatId].isMember = true

                newState[action.chatId].users = [
                    ...newState[action.chatId].users,
                    action.invitedUserId
                ]
                newState[action.chatId].invites = {
                    ...newState[action.chatId].invites,
                    [action.invitedUserId]: action.invitedById
                }
            }
            else if (action.removedUserId) {
                if (action.removedUserId === action.userId)
                    newState[action.chatId].isMember = false

                newState[action.chatId].users = newState[action.chatId].users
                    .filter(userId => userId !== action.removedUserId)

                newState[action.chatId].invites = {
                    ...newState[action.chatId].invites,
                }
                delete newState[action.chatId].invites[action.removedUserId]
            }
            else if(action.value) {
                switch (action.changedField) {
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