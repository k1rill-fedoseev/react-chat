import { combineReducers } from 'redux'
import chats from './chats'
import users from './users'
import messages from './messages'

export default combineReducers({
    chats,
    users,
    messages
})