import React, { Component } from 'react'
import { connect } from 'react-redux'
import NewChatBtn from './NewChatBtn'
import ChatItem from './ChatItem'

class ChatList extends Component {

    render() {
        return (
            <div className="chat-list">
                <div className="up-line">
                    <div  className="label">Chats</div>
                    <NewChatBtn/>
                </div>
                <ul id="chats">
                    {this.props.chats.map(chat => <ChatItem chat={chat} key={chat.id}/>)}
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({
        chats: state.chats
    }),
    dispatch => ({})
)(ChatList)