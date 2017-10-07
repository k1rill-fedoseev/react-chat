import { CHAT_SELECT, INVITE_ACCEPT_CLICK, INVITE_CLICK, SWITCH_MESSAGES_AND_CHAT_INFO } from '../../actions/frontend'
import { DELETE_CHAT_SUCCESS, SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'

export default (state = false, action) => {
    switch (action.type) {
        case INVITE_CLICK:
            return !state
        case CHAT_SELECT:
        case INVITE_ACCEPT_CLICK:
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
        case DELETE_CHAT_SUCCESS:
        case SWITCH_MESSAGES_AND_CHAT_INFO:
            return false
        default:
            return state
    }
}