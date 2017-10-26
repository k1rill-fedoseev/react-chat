import {
    CHANGE_USER_INFO_CLICK,
    DELETE_MESSAGES_CLICK, LOAD_MORE_CLICK, MARK_READ_FRONTEND, MESSAGE_INPUT_CHANGE, OPEN_PROFILE_CLICK, REMOVE_USER_CLICK,
    SEND_CLICK,
    USER_SELECT
} from '../actions/frontend'
import { DELETE_CHAT_SUCCESS, FETCH_CHAT_SUCCESS, FETCH_CHATS_SUCCESS, NEW_MESSAGE } from '../actions/responses'

export default store => next => action => {
    const state = store.getState()

    switch (action.type) {
        case SEND_CLICK:
            action.tempId = state.ui.tempId
        case DELETE_MESSAGES_CLICK:
            action.selectedMessages = state.ui.selectedMessages
        case LOAD_MORE_CLICK:
        case REMOVE_USER_CLICK:
        case MESSAGE_INPUT_CHANGE:
            action.selectedChat = state.ui.selectedChat
            break
        case MARK_READ_FRONTEND:
            action.newMessages = state.db.chats[state.ui.selectedChat].newMessages
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
        case FETCH_CHATS_SUCCESS:
        case CHANGE_USER_INFO_CLICK:
            action.userId = state.ui.loggedAccount
            break
        case OPEN_PROFILE_CLICK:
            if (!action.userId)
                action.userId = state.ui.loggedAccount
            break
        case DELETE_CHAT_SUCCESS:
            action.messagesList = state.ui.messagesLists[action.chatId]
            action.newMessages = state.db.chats[state.ui.selectedChat].newMessages
            break
    }
    next(action)
}