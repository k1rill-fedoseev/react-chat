import { DELETE_MESSAGES_CLICK, SEND_CLICK, sortChatsList } from '../actions/frontend'
import { FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, NEW_MESSAGE } from '../actions/responses'
import { compare } from '../helpers/index'

export default store => next => action => {
    next(action)

    switch (action.type) {
        case SEND_CLICK:
        case NEW_MESSAGE:
        case FETCH_CHATS_SUCCESS:
        case FETCH_CHAT_SUCCESS:
        case DELETE_MESSAGES_CLICK:
            const state = store.getState()
            next(sortChatsList([...state.ui.chatsList].sort(compare(state))))
            break
    }
}