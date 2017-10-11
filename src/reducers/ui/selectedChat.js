import { CHAT_SELECT, EXIT_CLICK } from '../../actions/frontend'
import { DELETE_CHAT_SUCCESS } from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case CHAT_SELECT:
            return action.chatId
        case EXIT_CLICK:
        case DELETE_CHAT_SUCCESS:
            return ''
        default:
            return state
    }
}