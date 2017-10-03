import React, { Component } from 'react'
import { connect } from 'react-redux'
import { messageInputIsEmpty, messageInputIsNotEmpty, sendClick } from '../actions/frontend'

class MessageInput extends Component {

    constructor(props) {
        const {selectedChat} = props

        super()

        this.state = {
            inputMessages: {
                [selectedChat]: ''
            }
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    componentWillReceiveProps(props) {
        const {startTyping, endTyping, selectedChat} = this.props
        const {inputMessages} = this.state

        if (inputMessages[selectedChat])
            endTyping(selectedChat)
        if (inputMessages[props.selectedChat])
            startTyping(props.selectedChat)
    }

    handleChange(e) {
        const {inputMessages} = this.state
        const {startTyping, endTyping, selectedChat} = this.props

        if (!inputMessages[selectedChat] && e.target.value)
            startTyping(selectedChat)
        else if (inputMessages[selectedChat] && !e.target.value)
            endTyping(selectedChat)

        this.setState({
            inputMessages: {
                ...inputMessages,
                [selectedChat]: e.target.value
            }
        })
    }

    handleClick() {
        const {send, endTyping, selectedChat, isMember} = this.props
        const {inputMessages} = this.state

        if (inputMessages[selectedChat] && inputMessages[selectedChat].length && isMember) {
            send(inputMessages[selectedChat])
            endTyping(selectedChat)
            this.setState(state => ({
                inputMessages: {
                    ...state.inputMessages,
                    [selectedChat]: ''
                }
            }))
        }
    }

    render() {
        const {selectedChat, isMember} = this.props
        const {inputMessages} = this.state

        return (
            <div className="input">
                <div className="fix">
                        <textarea className="text" id="mes-input" placeholder="Type your message ..."
                                  value={inputMessages[selectedChat] || ''}
                                  onChange={this.handleChange}/>
                </div>
                <div className={`send-btn ${isMember ? '' : 'disabled'}`} onClick={this.handleClick}/>
            </div>

        )
    }
}

export default connect(
    state => {
        const {selectedChat} = state.ui

        return {
            selectedChat,
            isMember: state.db.chats[selectedChat].isMember
        }
    },
    dispatch => ({
        send: message => dispatch(sendClick(message)),
        startTyping: chatId => dispatch(messageInputIsNotEmpty(chatId)),
        endTyping: chatId => dispatch(messageInputIsEmpty(chatId))
    })
)(MessageInput)