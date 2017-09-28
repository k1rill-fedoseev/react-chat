import { CHAT_SELECT, loadMoreClick } from '../actions/frontend'

export default store => next => action => {
    const state = store.getState()

    next(action)

    if (action.type === CHAT_SELECT
        && state.ui.messagesLists[action.chatId].length === 1
        && !state.db.chats[action.chatId].isFullLoaded)
        next(loadMoreClick())
}