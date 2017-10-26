import { DELETE_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, NEW_MESSAGE } from '../../actions/responses'
import { MARK_READ_FRONTEND } from '../../actions/frontend'

export default (state = 0, action) => {
    switch (action.type) {
        case FETCH_CHATS_SUCCESS:
            let newState = 0

            action.chats.forEach(chat => newState += chat.newMessages)
            return newState
        case MARK_READ_FRONTEND:
            return state - action.newMessages
        case NEW_MESSAGE:
            return action.chatId === action.selectedChat ? state : state + 1
        case DELETE_CHAT_SUCCESS:
            return state - action.newMessages
        default:
            return state
    }
}