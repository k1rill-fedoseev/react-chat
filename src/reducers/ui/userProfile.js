import {
    CHAT_SELECT, CLOSE_PROFILE_CLICK, EXIT_CLICK, INVITE_CLICK, NEW_CLICK,
    PROFILE_CLICK
} from '../../actions/frontend'

export default (state = '', action) => {
    switch (action.type) {
        case PROFILE_CLICK:
            return action.userId
        case CLOSE_PROFILE_CLICK:
        case NEW_CLICK:
        case CHAT_SELECT:
        case INVITE_CLICK:
        case EXIT_CLICK:
            return ''
        default:
            return state
    }
}