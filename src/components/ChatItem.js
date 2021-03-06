import React, { Component } from 'react'
import { connect } from 'react-redux'
import { chatSelect, markReadFrontend } from '../actions/frontend'
import { parseMs } from '../helpers/index'
import { subscribe, unsubscribe } from '../helpers/onlineController'
import Avatar from './Avatar'
import EllipsisText from './EllipsisText'

class ChatItem extends Component {

    constructor(props) {
        super()

        this.handleClick = this.handleClick.bind(this)
    }

    updateInterval(time) {
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

    componentWillMount() {
        const {time, to, isMe} = this.props

        if (time !== 0)
            this.updateInterval(time)
        if (to && !isMe)
            subscribe(to.id)
    }

    componentWillUnmount() {
        const {to} = this.props
        clearInterval(this.intervalId)
        clearTimeout(this.timeoutId)

        if (to)
            unsubscribe(to.id)
    }

    componentWillReceiveProps(props) {
        const {isSelected, markRead, chat, time, to, isMe} = props
        const {newMessages} = chat

        if (time !== 0)
            this.updateInterval(time)
        if (to && !isMe)
            subscribe(to.id)

        if (newMessages && isSelected && !this.props.isSelected)
            this.timeoutId = setTimeout(markRead, 2500)
        else if (!isSelected)
            clearTimeout(this.timeoutId)
    }

    handleClick() {
        const {isSelected, select} = this.props

        if (!isSelected)
            select()
    }

    render() {
        const {isSelected, chat, message, to, typingUser, typingUsersCount, time} = this.props

        if (!chat || (!chat.isRoom && !to))
            return null

        const {avatar, newMessages, isRoom, name} = chat

        return (
            <li className={'chat-item' + (isSelected
                ? ' active'
                : '')} onClick={this.handleClick}>
                <Avatar src={isRoom
                    ? avatar
                    : to.avatar}>
                    {newMessages > 0 && <div className="new-mes">{newMessages}</div>}
                </Avatar>
                <div className="info">
                    <div className="name">{isRoom
                        ? name
                        : `${to.name} ${to.surname}`}</div>
                    <div className="mes">
                        {typingUsersCount && typingUser
                            ? <EllipsisText text={`${typingUser.name} ${typingUser.surname} ${typingUsersCount > 1
                                ? `and ${typingUsersCount - 1} more are`
                                : 'is'} typing`}/>
                            : message}
                    </div>
                </div>
                <div className="info2">
                    {!isRoom && <div className={'tmblr ' + (to.online && 'online')}/>}
                    <div className="time">{time
                        ? parseMs(this.state.time)
                        : 'Infinity'}</div>
                </div>
            </li>
        )
    }
}

export default connect(
    (state, ownProps) => {
        const messagesList = state.ui.messagesLists[ownProps.chatId] || []

        const lastMessage = messagesList.length
            ? state.db.messages[messagesList[messagesList.length - 1]]
            : {
                message: '',
                time: 0
            }
        const chat = state.db.chats[ownProps.chatId]
        const typing = state.db.typing[ownProps.chatId]

        return {
            isSelected: ownProps.chatId === state.ui.selectedChat,
            chat,
            isMe: !chat.isRoom && chat.users.length === 1,
            message: lastMessage.message,
            time: lastMessage.time,
            to: state.db.users[chat.to],
            typingUser: typing
                ? state.db.users[typing[0]]
                : '',
            typingUsersCount: typing
                ? typing.length
                : 0
        }
    },
    (dispatch, ownProps) => ({
        select: () => dispatch(chatSelect(ownProps.chatId)),
        markRead: () => dispatch(markReadFrontend())
    })
)(ChatItem)