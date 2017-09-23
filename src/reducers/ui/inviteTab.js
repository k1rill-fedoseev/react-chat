import { CHAT_SELECT, INVITE_CLICK } from '../../actions/frontend'

export default (state = false, action) => {
    switch (action.type) {
        case INVITE_CLICK:
            return !state
        case CHAT_SELECT:
            return false
        default:
            return state
    }
}