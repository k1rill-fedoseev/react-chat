import React, { Component } from 'react'
import { connect } from 'react-redux'
import { chatSelect } from '../actions/frontend'

const parseMs = (ms) => {
    ms /= 1000
    if (ms < 30)
        return 'now'
    else if (ms < 3600)
        return Math.round(ms / 60) + ' min'
    else if (ms < 86400)
        return Math.round(ms / 3600) + ' hrs'
    else {
        let days = Math.round(ms / 86400)
        if (days === 1)
            return '1 day'
        return days + ' days'
    }
}

class ChatItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            time: Date.now() - props.time
        }

    }

    componentWillMount() {
        this.intervalId = setInterval(() => {
            this.setState({
                time: Date.now() - this.props.time
            })
        }, 30000)
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    componentWillReceiveProps(props) {
        this.setState({
            time: Date.now() - props.time
        })
    }

    render() {
        const {activeChat, chat, onClick, message} = this.props
        const time = parseMs(this.state.time)
        const {id, avatar, newMessages, isRoom, online, name} = chat
        return (
            <li className={'chat-item' + (id === activeChat.id ? ' active' : '')} id={id} onClick={onClick}>
                <div className="avatar">
                    {newMessages > 0 && <div className="new-mes">{newMessages}</div>}
                    <img src={avatar} alt="" width={40} height={40}/>
                </div>
                <div className="info">
                    <div className="name">{name}</div>
                    <div className="mes">{message}</div>
                </div>
                <div className="info2">
                    {!isRoom && <div className={'tmblr ' + (online && 'online')}/>}
                    <div className="time">{time}</div>
                </div>
            </li>
        )
    }
}

export default connect(
    (state, ownProps) => {
        const lastMessage = state.messages[ownProps.chat.id][0]
        return {
            activeChat: state.activeChat,
            message: lastMessage.message,
            time: lastMessage.time
        }
    },
    (dispatch, ownProps) => ({
        onClick: () => dispatch(chatSelect(ownProps.chat.id))
    })
)(ChatItem)