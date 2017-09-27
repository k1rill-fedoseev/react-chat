import React, { Component } from 'react'
import { connect } from 'react-redux'
import MessageInput from './MessageInput'
import { deleteMessagesClick, inviteClick } from '../actions/frontend'
import MessagesList from './MessagesList'

class MessagesTab extends Component {

    render() {
        const {chat, inviteTab, invite, to, isSelected, deleteMessages} = this.props
        const {name, isRoom} = chat

        return (
            <div id="messages">
                <div className="up-line">
                    <div className="left">
                        <div className="name">{isRoom ? name : `${to.name} ${to.surname}`}</div>
                        {!isRoom && <div className={`tmblr ${to.online ? 'online' : ''}`}/>}
                    </div>
                    <div className="right">
                        {isSelected && <span className="confirm-delete" onClick={deleteMessages}>&#61460;</span>}
                        {!inviteTab && isRoom && <span className="plus-user" onClick={invite}>+</span>}
                    </div>
                </div>
                <MessagesList />
                <MessageInput/>
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
            isSelected: Object.keys(state.ui.selectedMessages).length > 0
        }
    },
    dispatch => ({
        invite: () => dispatch(inviteClick()),
        deleteMessages: () => dispatch(deleteMessagesClick())
    })
)(MessagesTab)