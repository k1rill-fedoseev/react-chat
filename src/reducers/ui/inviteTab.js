import {
    CHAT_SELECT, EXIT_CLICK, INVITE_ACCEPT_CLICK, INVITE_CLICK,
    SWITCH_MESSAGES_AND_CHAT_INFO
} from '../../actions/frontend'
import { DELETE_CHAT_SUCCESS } from '../../actions/responses'

export default (state = false, action) => {
    switch (action.type) {
        case INVITE_CLICK:
            return !state
        case CHAT_SELECT:
        case INVITE_ACCEPT_CLICK:
        case DELETE_CHAT_SUCCESS:
        case SWITCH_MESSAGES_AND_CHAT_INFO:
        case EXIT_CLICK:
            return false
        default:
            return state
    }
}