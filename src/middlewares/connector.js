import {
    DELETE_MESSAGES_CLICK, LOAD_MORE_CLICK, MARK_READ, REMOVE_USER_CLICK, SEND_CLICK,
    USER_SELECT
} from '../actions/frontend'
import { FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, NEW_MESSAGE } from '../actions/responses'

export default store => next => action => {
    const state = store.getState()

    switch (action.type) {
        case SEND_CLICK:
            action.tempId = state.ui.tempId
        case DELETE_MESSAGES_CLICK:
            action.selectedMessages = state.ui.selectedMessages
        case MARK_READ:
        case LOAD_MORE_CLICK:
        case REMOVE_USER_CLICK:
            action.selectedChat = state.ui.selectedChat
            break
        case NEW_MESSAGE:
            action.selectedChat = state.ui.selectedChat
            action.userId = state.ui.loggedAccount
            break
        case USER_SELECT:
            action.newChatTab = state.ui.newChatTab
            action.isRoomCreateTab = state.ui.isRoomCreateTab
            break
        case FETCH_CHAT_SUCCESS:
            action.newMessages = state.ui.messagesLists[action.chat.id].length
        case FETCH_CHATS_SUCCESS:
            action.userId = state.ui.loggedAccount
            break
    }
    next(action)
}