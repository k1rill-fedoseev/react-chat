import React, { Component } from 'react'
import { connect } from 'react-redux'
import Message from './Message'
import LoadMore from './LoadMore'
import Divider from './Divider'
import { getScrollInfo, scroll } from '../helpers/scrollController'

class MessagesList extends Component {

    constructor(props) {
        super()

        this.state = {
            newMessages: props.chat.newMessages,
            lastReadMessageId: props.messagesList[props.messagesList.length - props.chat.newMessages]
        }
        this.handleScroll = this.handleScroll.bind(this)
    }

    messagesList() {
        const {messagesList} = this.props
        const {lastReadMessageId} = this.state
        const arr = []

        for (let i = 0; i < messagesList.length; ++i) {
            if (messagesList[i] === lastReadMessageId)
                arr.push(<Divider text={`${messagesList.length - i} new messages`} key={-1}/>)
            arr.push(<Message messageId={messagesList[i]} key={i}/>)
        }

        return arr
    }

    handleScroll(e) {
        const {id} = this.props.chat

        scroll(id, e.target.scrollTop, e.target.scrollHeight - e.target.offsetHeight)
    }

    componentWillReceiveProps(props) {
        if (this.props.chat.id !== props.chat.id)
            this.setState({
                newMessages: props.chat.newMessages,
                lastReadMessageId: props.messagesList[props.messagesList.length - props.chat.newMessages]
            })
    }

    componentDidUpdate() {
        const {id} = this.props.chat
        const {isEnd, position} = getScrollInfo(id)

        if (isEnd)
            this.node.scrollTop = this.node.scrollHeight
        else
            this.node.scrollTop = position
    }

    componentDidMount() {
        this.componentDidUpdate()
    }

    render() {
        const {isFullLoaded} = this.props.chat

        return (
            <ul id="chat" ref={node => this.node = node} onScroll={this.handleScroll}>
                {!isFullLoaded && <LoadMore/>}
                {this.messagesList()}
            </ul>
        )
    }
}

export default connect(
    state => ({
        chat: state.db.chats[state.ui.selectedChat],
        messagesList: state.ui.messagesLists[state.ui.selectedChat]
    }),
    dispatch => ({})
)(MessagesList)