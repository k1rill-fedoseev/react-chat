import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MemberAccount } from './Account'

class ChatInfo extends Component {

    users() {
        const {users, invites} = this.props.chat

        return users.map((userId, index) =>
            <MemberAccount key={userId} userId={userId} creatorId={users[0]} invitedById={invites[userId]} />
        )
    }

    render() {
        return (
            <div className="chat-info">
                <ul className="users">
                    {this.users()}
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({
        chat: state.db.chats[state.ui.selectedChat],
        messagesList: state.ui.messagesLists[state.ui.selectedChat]
    }),
    dispatch => ({})
)(ChatInfo)