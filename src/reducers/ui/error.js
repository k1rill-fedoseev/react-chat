import { CLEAR_ERROR } from '../../actions/frontend'
import {
    CREATE_ERROR, DELETE_CHAT_ERROR, FETCH_CHAT_ERROR, FETCH_CHATS_ERROR, FETCH_MESSAGES_ERROR,
    FETCH_ONLINE_USERS_ERROR,
    FETCH_USERS_ERROR, INVITE_USERS_ERROR,
    SEARCH_USERS_ERROR,
    SEND_ERROR,
    SIGN_IN_ERROR,
    SIGN_UP_ERROR
} from '../../actions/responses'

export default (state = '', action) => {
    switch (action.type) {
        case CLEAR_ERROR:
            return ''
        case SIGN_IN_ERROR:
        case SIGN_UP_ERROR:
        case CREATE_ERROR:
        case SEND_ERROR:
        case FETCH_USERS_ERROR:
        case FETCH_CHATS_ERROR:
        case FETCH_CHAT_ERROR:
        case FETCH_MESSAGES_ERROR:
        case INVITE_USERS_ERROR:
        case SEARCH_USERS_ERROR:
        case FETCH_ONLINE_USERS_ERROR:
        case DELETE_CHAT_ERROR:
            console.log(`[${Date.now()}] ERROR ${action.type} : ${action.error}`)
            return 'ERROR ' + action.type + ': ' + action.error
        default:
            return state
    }
}