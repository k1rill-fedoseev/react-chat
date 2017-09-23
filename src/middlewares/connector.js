import { MARK_READ, SEND_CLICK, USER_SELECT } from '../actions/frontend'
import { FETCH_CHAT_SUCCESS, NEW_MESSAGE } from '../actions/responses'

export default store => next => action => {
    const state = store.getState()

    switch (action.type) {
        case SEND_CLICK:
            action.tempId = state.ui.tempId
        case NEW_MESSAGE:
        case MARK_READ:
            action.selectedChat = state.ui.selectedChat
            break
        case USER_SELECT:
            action.isRoomCreateTab = state.ui.isRoomCreateTab
            break
        case FETCH_CHAT_SUCCESS:
            action.newMessages = state.ui.messagesLists[action.chat.id].length
            break
    }
    next(action)
}