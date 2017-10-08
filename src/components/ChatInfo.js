import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MemberAccount } from './Account'
import {
    changeChatInfoClick, CHAT_AVATAR, CHAT_DESCRIPTION, CHAT_NAME, deleteChatClick,
    leaveChatClick
} from '../actions/frontend'
import SmartInput from './SmartInput'

class ChatInfo extends Component {

    users() {
        const {users, invites} = this.props.chat

        return users.map((userId, index) =>
            <MemberAccount key={userId} userId={userId} creatorId={users[0]} invitedById={invites[userId]}/>
        )
    }

    render() {
        const {leave, chat, deleteChat, rename, changeAvatar, changeDesc} = this.props
        const {isMember, name, avatar, description} = chat

        if(!chat.isRoom)
            return (
                <div className="chat-info">
                    <div className="btn delete-room" onClick={deleteChat}>Delete room</div>
                </div>
            )

        return (
            <div className="chat-info">
                <SmartInput label="Name" minLength={1} maxLength={30} value={name} onAccept={rename}/>
                <SmartInput label="Avatar" maxLength={256} value={avatar === undefined ? '' : avatar} onAccept={changeAvatar}/>
                <SmartInput label="Description" maxLength={256} value={description === undefined ? '' : description} onAccept={changeDesc}/>
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
        deleteChat: () => dispatch(deleteChatClick()),
        rename: name => dispatch(changeChatInfoClick(CHAT_NAME, name)),
        changeAvatar: avatar => dispatch(changeChatInfoClick(CHAT_AVATAR, avatar)),
        changeDesc: description => dispatch(changeChatInfoClick(CHAT_DESCRIPTION, description)),
    })
)(ChatInfo)