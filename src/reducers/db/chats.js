import { FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE } from '../../actions/responses'
import { LOAD_MORE_CLICK, MARK_READ } from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case FETCH_CHATS_SUCCESS:
            const newState = {}
            action.chats.forEach(chat => {
                newState[chat.id] = chat
            })

            return newState
        case FETCH_CHAT_SUCCESS:
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
            if (action.selectedChat !== action.chatId && state[action.chatId])
                return {
                    ...state,
                    [action.chatId]: {
                        ...state[action.chatId],
                        newMessages: state[action.chatId].newMessages + 1
                    }
                }

            return state
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
        default:
            return state
    }
}