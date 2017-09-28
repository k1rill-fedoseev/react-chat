import React, { Component } from 'react'
import { connect } from 'react-redux'
import { messageInputIsEmpty, messageInputIsNotEmpty, sendClick } from '../actions/frontend'

class MessageInput extends Component {

    constructor(props) {
        super()

        this.state = {
            inputMessage: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(e) {
        const {inputMessage} = this.state
        const {startTyping, endTyping} = this.props

        if (!inputMessage && e.target.value)
            startTyping()
        else if (inputMessage && !e.target.value)
            endTyping()

        this.setState({
            inputMessage: e.target.value
        })
    }

    handleClick() {
        const {send, endTyping} = this.props

        if (this.state.inputMessage.length) {
            send(this.state.inputMessage)
            endTyping()
            this.setState({
                inputMessage: ''
            })
        }
    }

    render() {
        return (
            <div className="input">
                <div className="fix">
                        <textarea className="text" id="mes-input" placeholder="Type your message ..."
                                  value={this.state.inputMessage}
                                  onChange={this.handleChange}/>
                </div>
                <div id="send-btn" onClick={this.handleClick}/>
            </div>

        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        send: message => dispatch(sendClick(message)),
        startTyping: () => dispatch(messageInputIsNotEmpty()),
        endTyping: () => dispatch(messageInputIsEmpty())
    })
)(MessageInput)