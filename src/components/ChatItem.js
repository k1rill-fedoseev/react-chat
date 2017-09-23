import React, { Component } from 'react'
import { connect } from 'react-redux'
import { chatSelect, markRead } from '../actions/frontend'
import { parseMs } from '../helpers/index'
import { subscribe, unsubscribe } from '../helpers/onlineController'
import Avatar from './Avatar'

class ChatItem extends Component {

    updateInterval({time}) {
        clearInterval(this.intervalId)

        this.setState({
            time: Date.now() - time
        })

        this.intervalId = setInterval(() => {
            this.setState({
                time: Date.now() - time
            })
        }, 30000)
    }

    subscribe({to}) {
        if(to)
            subscribe(to.id)
    }

    componentWillMount() {
        this.updateInterval(this.props)
        this.subscribe(this.props)
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
        clearTimeout(this.timeoutId)
        unsubscribe(this.props)
    }

    componentWillReceiveProps(props) {
        const {isSelected, markRead, chat} = props
        const {newMessages} = chat

        this.updateInterval(props)
        this.subscribe(props)

        if(newMessages && isSelected)
            this.timeoutId = setTimeout(markRead, 2500)
        else
            clearTimeout(this.timeoutId)
    }

    render() {
        const {isSelected, chat, select, message, to} = this.props
        if (!chat || !chat.isRoom && !to)
            return null

        const timeStr = parseMs(this.state.time)
        const {avatar, newMessages, isRoom, name} = chat

        return (
            <li className={'chat-item' + (isSelected ? ' active' : '')} onClick={select}>
                <div className="avatar">
                    {newMessages > 0 && <div className="new-mes">{newMessages}</div>}
                    <Avatar src={isRoom ? avatar : to.avatar}/>
                </div>
                <div className="info">
                    <div className="name">{isRoom ? name : `${to.name} ${to.surname}`}</div>
                    <div className="mes">{message}</div>
                </div>
                <div className="info2">
                    {!isRoom && <div className={'tmblr ' + (to.online && 'online')}/>}
                    <div className="time">{timeStr}</div>
                </div>
            </li>
        )
    }
}

export default connect(
    (state, ownProps) => {
        const messagesList = state.ui.messagesLists[ownProps.chatId]
        if (!messagesList)
            return {}

        const lastMessage = state.db.messages[messagesList[messagesList.length - 1]]
        const chat = state.db.chats[ownProps.chatId]
        return {
            isSelected: ownProps.chatId === state.ui.selectedChat,
            chat,
            message: lastMessage.message,
            time: lastMessage.time,
            to: state.db.users[chat.to]
        }
    },
    (dispatch, ownProps) => ({
        select: () => dispatch(chatSelect(ownProps.chatId)),
        markRead: () => dispatch(markRead())
    })
)(ChatItem)