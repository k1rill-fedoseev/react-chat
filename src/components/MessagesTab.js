import React, { Component } from 'react'
import { connect } from 'react-redux'
import MessageInput from './MessageInput'
import { inviteClick } from '../actions/frontend'
import MessagesList from './MessagesList'

class MessagesTab extends Component {

    render() {
        const {chat, inviteTab, invite, to} = this.props
        const {name, isRoom} = chat

        return (
            <div id="messages">
                <div className="up-line">
                    <div className="left">
                        <div className="name">{isRoom ? name : `${to.name} ${to.surname}`}</div>
                        {!isRoom && <div className={`tmblr ${to.online ? 'online' : ''}`}/>}
                    </div>
                    {!inviteTab && isRoom && <div className="plus-user" onClick={invite}>+</div>}
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
            inviteTab: state.ui.inviteTab
        }
    },
    dispatch => ({
        invite: () => dispatch(inviteClick())
    })
)(MessagesTab)