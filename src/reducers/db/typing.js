import {
    DELETE_CHAT_SUCCESS, END_TYPING_RESPONSE, NEW_MESSAGE, NEW_MESSAGE_WITH_LEFT, NEW_MESSAGE_WITH_REMOVE,
    START_TYPING_RESPONSE
} from '../../actions/responses'
import { EXIT_CLICK } from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case START_TYPING_RESPONSE:
            if(!state[action.chatId])
                return {
                    ...state,
                    [action.chatId]: [action.userId]
                }

            if(state[action.chatId].includes(action.userId))
                return state

            return {
                ...state,
                [action.chatId]: [
                        ...state[action.chatId],
                        action.userId
                    ]
            }
        case END_TYPING_RESPONSE:
            if(!state[action.chatId])
                return state

            return {
                ...state,
                [action.chatId]: state[action.chatId].filter(userId => userId !== action.userId)
            }
        case NEW_MESSAGE:
            if(action.subtype !== NEW_MESSAGE_WITH_LEFT && (action.subtype !== NEW_MESSAGE_WITH_REMOVE || action.loggedAccount !== action.userId))
                return state

            return {
                ...state,
                [action.chatId]: []
            }
        case DELETE_CHAT_SUCCESS:
            return {
                ...state,
                [action.chatId]: []
            }
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}