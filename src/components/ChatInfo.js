import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MemberAccount, SimpleMemberAccount } from './Account'
import {
    changeChatInfoClick, CHAT_AVATAR, CHAT_DESCRIPTION, CHAT_NAME, deleteChatClick,
    leaveChatClick
} from '../actions/frontend'
import SmartInput from './SmartInput'
import ProfileField from './ProfileField'

class ChatInfo extends Component {

    users() {
        const {users, invites, isMember} = this.props.chat

        return users.map((userId, index) =>
            <MemberAccount key={userId} userId={userId} creatorId={users[0]} invitedById={invites[userId]} canRemove={isMember}/>
        )
    }

    simpleUsers() {
        const {users} = this.props.chat

        return users.map((userId, index) =>
            <SimpleMemberAccount key={userId} userId={userId}/>
        )
    }

    render() {
        const {leave, chat, deleteChat, rename, changeAvatar, changeDescription} = this.props
        const {isMember, name, avatar, description} = chat

        if (!chat.isRoom)
            return (
                <div className="chat-info">
                    <ul className="users">
                        {this.simpleUsers()}
                    </ul>
                    <div className="btn delete-room" onClick={deleteChat}>Delete room</div>
                </div>
            )

        if (isMember)
            return (
                <div className="chat-info">
                    <SmartInput label="Name" minLength={1} maxLength={30} value={name} onAccept={rename}/>
                    <SmartInput label="Avatar" maxLength={256} value={avatar === undefined
                        ? ''
                        : avatar} onAccept={changeAvatar}/>
                    <SmartInput label="Description" maxLength={256} value={description === undefined
                        ? ''
                        : description} onAccept={changeDescription}/>
                    <ul className="users">
                        {this.users()}
                    </ul>
                    <div className="btn leave" onClick={leave}>Leave room</div>
                    <div className="btn delete-room" onClick={deleteChat}>Delete room</div>
                </div>
            )

        return (
            <div className="chat-info">
                <ProfileField label="Name" value={name}/>
                <ProfileField label="Avatar" value={avatar === undefined
                    ? ''
                    : avatar}/>
                <ProfileField label="Description" value={description === undefined
                    ? ''
                    : description}/>
                <ul className="users">
                    {this.users()}
                </ul>
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
        changeDescription: description => dispatch(changeChatInfoClick(CHAT_DESCRIPTION, description))
    })
)(ChatInfo)