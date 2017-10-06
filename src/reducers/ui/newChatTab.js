import { CHAT_SELECT, CREATE_CLICK, NEW_CLICK } from '../../actions/frontend'
import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'

export default (state = false, action) => {
    switch (action.type) {
        case NEW_CLICK:
            return !state
        case CHAT_SELECT:
        case CREATE_CLICK:
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return false
        default:
            return state
    }
}