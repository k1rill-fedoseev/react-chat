import { CHAT_SELECT, markRead } from '../actions/frontend'

export default store => next => action => {
    const state = store.getState()
    const {selectedChat} = state.ui

    if (action.type === CHAT_SELECT && selectedChat && state.db.chats[selectedChat].newMessages)
        next(markRead())

    next(action)
}