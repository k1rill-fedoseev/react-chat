import { combineReducers } from 'redux'
import chats from './chats'
import users from './users'
import messages from './messages'
import typing from './typing'

export default combineReducers({
    chats,
    users,
    messages,
    typing
})