import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MemberAccount } from './Account'
import { deleteChatClick, leaveChatClick } from '../actions/frontend'

class ChatInfo extends Component {

    users() {
        const {users, invites} = this.props.chat

        return users.map((userId, index) =>
            <MemberAccount key={userId} userId={userId} creatorId={users[0]} invitedById={invites[userId]}/>
        )
    }

    render() {
        const {leave, chat, deleteChat} = this.props
        const {isMember} = chat

        return (
            <div className="chat-info">
                <ul className="users">
                    {this.users()}
                </ul>
                {isMember &&
                <div className="btn leave" onClick={leave}>Leave room</div>}
                <div className="btn delete-room" onClick={deleteChat}>Delete room</div>
            </div>
        )
    }
}

export default connect(
    state => ({
        chat: state.db.chats[state.ui.selectedChat],
        messagesList: state.ui.messagesLists[state.ui.selectedChat]
    }),
    dispatch => ({
        leave: () => dispatch(leaveChatClick()),
        deleteChat: () => dispatch(deleteChatClick())
    })
)(ChatInfo)