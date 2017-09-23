import { CHAT_SELECT, NEW_CLICK } from '../../actions/frontend'

export default (state = false, action) => {
    switch (action.type) {
        case NEW_CLICK:
            return !state
        case CHAT_SELECT:
            return false
        default:
            return state
    }
}