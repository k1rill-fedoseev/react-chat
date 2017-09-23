import { CHAT_SELECT } from '../../actions/frontend'
import { SIGN_IN_SUCCESS, SIGN_UP_SUCCESS } from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case CHAT_SELECT:
            return action.chatId
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return ''
        default:
            return state
    }
}