import { FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS } from '../../actions/responses'
import { EXIT, SORT_CHATS_LIST } from '../../actions/frontend'

export default (state = [], action) => {
    switch (action.type) {
        case FETCH_CHATS_SUCCESS:
            return action.chats.map(chat => chat.id)
        case FETCH_CHAT_SUCCESS:
            if(!state.includes(action.chat.id))
                return [...state, action.chat.id]
            return state
        case SORT_CHATS_LIST:
            return action.chatsList
        case EXIT:
            return []
        default:
            return state
    }
}