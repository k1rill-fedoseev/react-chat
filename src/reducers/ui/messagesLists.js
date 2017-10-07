import {
    DELETE_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, FETCH_MESSAGES_SUCCESS, NEW_MESSAGE,
    SEND_SUCCESS
} from '../../actions/responses'
import { DELETE_MESSAGES_CLICK, EXIT_CLICK, SEND_CLICK } from '../../actions/frontend'

export default (state = {}, action) => {
    let listCopy

    switch (action.type) {
        case NEW_MESSAGE:
            listCopy = state[action.chatId]
                ? [...state[action.chatId]]
                : []
            listCopy.push(action.message.id)

            return {...state, [action.chatId]: listCopy}
        case FETCH_MESSAGES_SUCCESS:
            listCopy = [...state[action.chatId]]
            listCopy.unshift(...action.messages
                .reverse()
                .map(mes => mes.id))

            return {...state, [action.chatId]: listCopy}
        case FETCH_CHATS_SUCCESS:
            const messagesLists = {}

            action.chats.forEach((chat, index) => {
                messagesLists[chat.id] = action.messages[index].id
                    ? [action.messages[index].id]
                    : []
            })

            return messagesLists
        case SEND_CLICK:
            listCopy = [...state[action.selectedChat]]
            listCopy.push(`temp${action.tempId}`)

            return {...state, [action.selectedChat]: listCopy}
        case SEND_SUCCESS:
            listCopy = [...state[action.chatId]]

            for (let i = listCopy.length - 1; i >= 0; --i) {
                if (listCopy[i] === `temp${action.tempId}`) {
                    listCopy[i] = action.message.id
                    break
                }
            }

            return {...state, [action.chatId]: listCopy}
        case DELETE_MESSAGES_CLICK:
            return {
                ...state,
                [action.selectedChat]: state[action.selectedChat].filter(
                    messageId => !action.selectedMessages[messageId]
                )
            }
        case DELETE_CHAT_SUCCESS:
            const newState = {...state}
            delete newState[action.chatId]

            return newState
        case EXIT_CLICK:
            return {}
        default:
            return state
    }
}