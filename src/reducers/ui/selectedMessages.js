import { CHAT_SELECT, DELETE_MESSAGES_CLICK, MESSAGE_SELECT, NEW_CLICK } from '../../actions/frontend'

export default (state = {}, action) => {
    switch (action.type) {
        case CHAT_SELECT:
        case NEW_CLICK:
        case DELETE_MESSAGES_CLICK:
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