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

        if(inputMessages[selectedChat])
            endTyping(selectedChat)
        if(inputMessages[props.selectedChat])
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
        const {send, endTyping, selectedChat} = this.props
        const {inputMessages} = this.state

        if (inputMessages[selectedChat].length) {
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
        const {selectedChat} = this.props
        const {inputMessages} = this.state

        return (
            <div className="input">
                <div className="fix">
                        <textarea className="text" id="mes-input" placeholder="Type your message ..."
                                  value={inputMessages[selectedChat] || ''}
                                  onChange={this.handleChange}/>
                </div>
                <div id="send-btn" onClick={this.handleClick}/>
            </div>

        )
    }
}

export default connect(
    state => ({
        selectedChat: state.ui.selectedChat
    }),
    dispatch => ({
        send: message => dispatch(sendClick(message)),
        startTyping: chatId => dispatch(messageInputIsNotEmpty(chatId)),
        endTyping: chatId => dispatch(messageInputIsEmpty(chatId))
    })
)(MessageInput)