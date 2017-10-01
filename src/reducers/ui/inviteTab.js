import { CHAT_SELECT, INVITE_ACCEPT_CLICK, INVITE_CLICK } from '../../actions/frontend'

export default (state = false, action) => {
    switch (action.type) {
        case INVITE_CLICK:
            return !state
        case CHAT_SELECT:
        case INVITE_ACCEPT_CLICK:
            return false
        default:
            return state
    }
}