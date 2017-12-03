import { CHAT_SELECT, CREATE_CLICK, EXIT_CLICK, NEW_CLICK } from '../../actions/frontend'

export default (state = false, action) => {
    switch (action.type) {
        case NEW_CLICK:
            return !state
        case CHAT_SELECT:
        case CREATE_CLICK:
        case EXIT_CLICK:
            return false
        default:
            return state
    }
}