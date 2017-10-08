import React, { Component } from 'react'
import { connect } from 'react-redux'
import MessageInput from './MessageInput'
import { deleteMessagesClick, inviteClick, switchMessagesAndChatInfo } from '../actions/frontend'
import MessagesList from './MessagesList'
import ChatInfo from './ChatInfo'

class MainTab extends Component {

    constructor(props) {
        super()

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        const {switchMessagesAndChatInfo} = this.props

        switchMessagesAndChatInfo()
    }

    render() {
        const {
            chat, inviteTab, invite, to, isSelected,
            deleteMessages, isSwitchedToChatInfo
        } = this.props
        const {name, isRoom, isMember} = chat

        return (
            <div id="messages">
                <div className="up-line">
                    <div className="left">
                        <div className="name" onClick={this.handleClick}>
                            {isRoom
                                ? name
                                : `${to.name} ${to.surname}`}
                        </div>
                        {!isRoom &&
                        <div className={`tmblr ${to.online
                            ? 'online'
                            : ''}`}/>}
                    </div>
                    <div className="right">
                        {isSelected && <span className="confirm-delete" onClick={deleteMessages}>&#61460;</span>}
                        {!inviteTab && isRoom && isMember && <span className="plus-user" onClick={invite}>+</span>}
                    </div>
                </div>
                {!isSwitchedToChatInfo && <MessagesList />}
                {isSwitchedToChatInfo && <ChatInfo />}
                {!isSwitchedToChatInfo && <MessageInput/>}
            </div>
        )
    }
}

export default connect(
    state => {
        const chat = state.db.chats[state.ui.selectedChat]

        return {
            chat,
            to: state.db.users[chat.to],
            inviteTab: state.ui.inviteTab,
            isSelected: Object.keys(state.ui.selectedMessages).length > 0,
            isSwitchedToChatInfo: state.ui.isSwitchedToChatInfo
        }
    },
    dispatch => ({
        switchMessagesAndChatInfo: () => dispatch(switchMessagesAndChatInfo()),
        invite: () => dispatch(inviteClick()),
        deleteMessages: () => dispatch(deleteMessagesClick())
    })
)(MainTab)