import { combineReducers } from 'redux'
import isSignInTab from './isSignInTab'
import loggedAccount from './loggedAccount'
import error from './error'
import inviteTab from './inviteTab'
import isRoomCreateTab from './isRoomCreateTab'
import messagesLists from './messagesLists'
import chatsList from './chatsList'
import newChatTab from './newChatTab'
import selectedChat from './selectedChat'
import selectedUsers from './selectedUsers'
import tempId from './tempId'
import usersList from './usersList'
import selectedMessages from './selectedMessages'
import isSwitchedToChatInfo from './isSwitchedToChatInfo'
import userProfile from './userProfile'

export default combineReducers({
    error,
    inviteTab,
    isRoomCreateTab,
    isSignInTab,
    isSwitchedToChatInfo,
    loggedAccount,
    messagesLists,
    chatsList,
    newChatTab,
    selectedChat,
    selectedUsers,
    selectedMessages,
    tempId,
    usersList,
    userProfile
})
