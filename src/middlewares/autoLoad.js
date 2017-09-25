import { CHAT_SELECT, loadMoreClick } from '../actions/frontend'

export default store => next => action => {
    const state = store.getState()

    next(action)

    if(action.type === CHAT_SELECT && state.ui.messagesLists[action.chatId].length < 2)
        next(loadMoreClick())
}