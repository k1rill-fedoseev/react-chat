import React, { Component } from 'react'
import { connect } from 'react-redux'
import NewChatBtn from './NewChatBtn'
import ChatItem from './ChatItem'

class ChatsList extends Component {

    chatItems() {
        const {chatIds} = this.props

        return chatIds.map(
            chatId => <ChatItem chatId={chatId} key={chatId}/>
        )
    }

    render() {
        return (
            <div className="chat-list">
                <div className="up-line">
                    <div className="label">Chats</div>
                    <NewChatBtn/>
                </div>
                <ul id="chats">
                    {this.chatItems()}
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({
        chatIds: state.ui.chatsList
    }),
    dispatch => ({})
)(ChatsList)