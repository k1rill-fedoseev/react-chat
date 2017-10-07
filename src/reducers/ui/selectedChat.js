import { CHAT_SELECT, EXIT_CLICK } from '../../actions/frontend'
import { DELETE_CHAT_SUCCESS, SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case CHAT_SELECT:
            return action.chatId
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
        case EXIT_CLICK:
        case DELETE_CHAT_SUCCESS:
            return ''
        default:
            return state
    }
}