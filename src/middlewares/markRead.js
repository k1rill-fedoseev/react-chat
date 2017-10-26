import { CHAT_SELECT, markReadFrontend } from '../actions/frontend'

export default store => next => action => {
    const state = store.getState()
    const {selectedChat} = state.ui

    if (action.type === CHAT_SELECT && selectedChat && state.db.chats[selectedChat].newMessages)
        next(markReadFrontend())

    next(action)
}