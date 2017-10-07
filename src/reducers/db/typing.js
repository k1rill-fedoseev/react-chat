import { DELETE_CHAT_SUCCESS, END_TYPING_RESPONSE, START_TYPING_RESPONSE } from '../../actions/responses'
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
        case DELETE_CHAT_SUCCESS:
            const newState = {...state}
            delete newState[action.chatId]

            return newState
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}