import { CHAT_SELECT, EXIT_CLICK, SWITCH_MESSAGES_AND_CHAT_INFO } from '../../actions/frontend'

export default (state = false, action) => {
    switch (action.type) {
        case CHAT_SELECT:
        case EXIT_CLICK:
            return false
        case SWITCH_MESSAGES_AND_CHAT_INFO:
            return !state
        default:
            return state
    }
}