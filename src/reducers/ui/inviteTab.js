import { CHAT_SELECT, INVITE_ACCEPT_CLICK, INVITE_CLICK } from '../../actions/frontend'
import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'

export default (state = false, action) => {
    switch (action.type) {
        case INVITE_CLICK:
            return !state
        case CHAT_SELECT:
        case INVITE_ACCEPT_CLICK:
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return false
        default:
            return state
    }
}