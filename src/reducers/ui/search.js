import {
    CHAT_SELECT, EXIT_CLICK, INVITE_ACCEPT_CLICK, INVITE_CLICK, NEW_CLICK, SEARCH_CHANGE,
    SWITCH_MESSAGES_AND_CHAT_INFO
} from '../../actions/frontend'
import { DELETE_CHAT_SUCCESS } from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case SEARCH_CHANGE:
            return action.search
        case INVITE_CLICK:
        case CHAT_SELECT:
        case NEW_CLICK:
        case INVITE_ACCEPT_CLICK:
        case DELETE_CHAT_SUCCESS:
        case SWITCH_MESSAGES_AND_CHAT_INFO:
        case EXIT_CLICK:
            return ''
        default:
            return state
    }
}