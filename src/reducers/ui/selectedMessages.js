import {
    CHAT_SELECT, DELETE_MESSAGES_CLICK, EXIT_CLICK, MESSAGE_SELECT, NEW_CLICK,
    SWITCH_MESSAGES_AND_CHAT_INFO
} from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case CHAT_SELECT:
        case NEW_CLICK:
        case DELETE_MESSAGES_CLICK:
        case EXIT_CLICK:
        case SWITCH_MESSAGES_AND_CHAT_INFO:
            return {}
        case MESSAGE_SELECT:
            const stateCopy = {...state}

            if (stateCopy[action.messageId])
                delete stateCopy[action.messageId]
            else
                stateCopy[action.messageId] = true

            return stateCopy
        default:
            return state
    }
}