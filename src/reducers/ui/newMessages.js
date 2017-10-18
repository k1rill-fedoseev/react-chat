import { FETCH_CHATS_SUCCESS, NEW_MESSAGE } from '../../actions/responses'
import { MARK_READ } from '../../actions/frontend'

export default (state = 0, action) => {
    switch (action.type) {
        case FETCH_CHATS_SUCCESS:
            let newState = 0

            action.chats.forEach(chat => newState += chat.newMessages)
            return newState
        case MARK_READ:
            return state - action.newMessages
        case NEW_MESSAGE:
            return action.chatId === action.selectedChat ? state : state + 1
        default:
            return state
    }
}