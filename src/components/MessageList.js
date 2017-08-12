import React, { Component } from 'react'
import { connect } from 'react-redux'
import Message from './Message'
import MessageInput from './MessageInput'
import LoadMore from './LoadMore'
import { inviteClick } from '../actions/frontend'

class MessageList extends Component {

    render() {
        const {chat, phase, messages, invite} = this.props
        const {name, online, isRoom} = chat
        const {isStart} = messages[messages.length - 1]|| false

        const arr = []
        for (let i = messages.length - 1; i >= 0; --i)
            arr.push(<Message message={messages[i]} key={i}/>)
        return (
            <div id="messages">
                <div className="up-line">
                    <div className="left">
                        <div className="name">{name}</div>
                        <div className={"tmblr" + (online && "online")}/>
                    </div>
                    {phase !== 4 && isRoom && <div className="plus-user" onClick={invite}>+</div>}
                </div>
                <ul id="chat">
                    {!isStart && <LoadMore/>}
                    {arr}
                </ul>
                <MessageInput/>
            </div>
        )
    }
}

export default connect(
    state => ({
        chat: state.activeChat,
        messages: state.messages[state.activeChat.id],
        phase: state.phase
    }),
    dispatch => ({
        invite: () => dispatch(inviteClick())
    })
)(MessageList)