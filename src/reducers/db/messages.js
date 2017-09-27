import { DELETE_MESSAGES_CLICK, SEND_CLICK } from '../../actions/frontend'
import {
    FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE,
    SEND_SUCCESS
} from '../../actions/responses'

export default (state = {}, action) => {
    let newState

    switch(action.type) {
        case SEND_CLICK:
            return {...state, [`temp${action.tempId}`]: {
                message: action.message,
                time: Date.now(),
                id: `temp${action.tempId}`
            }}
        case NEW_MESSAGE:
            return {...state, [action.message.id]: action.message}
        case SEND_SUCCESS:
            newState = {...state}

            delete newState[`temp${action.tempId}`]
            newState[action.message.id] = action.message
            return newState
        case FETCH_CHATS_SUCCESS:
            newState = {}

            action.messages.forEach(message => {
                if(message.id)
                    newState[message.id] = message
            })
            return newState
        case FETCH_MESSAGES_SUCCESS:
            newState = {...state}

            action.messages.forEach(message =>
                newState[message.id] = message
            )
            return newState
        case DELETE_MESSAGES_CLICK:
            newState = {...state}

            Object.keys(action.selectedMessages)
                .forEach(key => delete newState[key])
            return newState
        default:
            return state
    }
}