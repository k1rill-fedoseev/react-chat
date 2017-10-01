import { FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE } from '../../actions/responses'
import { EXIT, LOAD_MORE_CLICK, MARK_READ, REMOVE_USER_CLICK } from '../../actions/frontend'

export default (state = {}, action) => {
    let newState

    switch (action.type) {
        case FETCH_CHATS_SUCCESS:
            newState = {}

            action.chats.forEach(chat => {
                const invites = {}

                chat.invites.forEach((invite, index) => {
                    if (invite)
                        invites[chat.users[index]] = invite
                })
                chat.invites = invites

                newState[chat.id] = chat
            })

            return newState
        case FETCH_CHAT_SUCCESS:
            newState = {...state}
            const invites = {}

            action.chat.invites.forEach((invite, index) => {
                if (invite)
                    invites[action.chat.users[index]] = invite
            })
            action.chat.invites = invites

            return {
                ...state,
                [action.chat.id]: {
                    ...action.chat,
                    newMessages: action.newMessages
                }
            }
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
            if((!action.invitedUserId && !action.removedUserId && action.selectedChat === action.chatId) || !state[action.chatId])
                return state

            newState = {
                ...state,
                [action.chatId]: {
                    ...state[action.chatId],
                    newMessages: state[action.chatId].newMessages + 1
                }
            }

            if (action.invitedUserId) {
                newState[action.chatId].users = [
                    ...newState[action.chatId].users,
                   action.invitedUserId
                ]
                newState[action.chatId].invites = {
                    ...newState[action.chatId].invites,
                    [action.invitedUserId]: action.invitedById
                }
            }

            if (action.removedUserId) {
                newState[action.chatId].users = newState[action.chatId].users
                    .filter(userId => userId !== action.removedUserId)

                newState[action.chatId].invites = {
                    ...newState[action.chatId].invites,
                }
                delete newState[action.chatId].invites[action.removedUser]
            }

            return newState
        case MARK_READ:
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
        case REMOVE_USER_CLICK:
            const invitesCopy = {...state[action.selectedChat].invites}
            delete invitesCopy[action.userId]
            newState = {...state}

            newState[action.selectedChat] = {...state[action.selectedChat]}

            newState[action.selectedChat].users = state[action.selectedChat].users
                .filter(userId => userId !== action.userId)
            newState[action.selectedChat].invites = invitesCopy
            return newState
        case EXIT:
            return {}
        default:
            return state
    }
}