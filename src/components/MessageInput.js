import React, { Component } from 'react'
import { connect } from 'react-redux'
import { messageInputChange, sendClick } from '../actions/frontend'

class MessageInput extends Component {

    constructor(props) {
        super()

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }


    handleChange(e) {
        const {inputChange} = this.props
        const {value} = e.target

        inputChange(value)
    }

    handleClick() {
        const {send, value} = this.props

        if(value && value.length <= 1024)
            send(value)
    }

    render() {
        const {isMember, value} = this.props

        return (
            <div className="input">
                <div className="fix">
                        <textarea className="text" id="mes-input" placeholder="Type your message ..."
                                  value={value}
                                  onChange={this.handleChange}/>
                </div>
                <div className={`send-btn ${isMember && value && value.length <= 1024
                    ? ''
                    : 'disabled'}`} onClick={this.handleClick}/>
            </div>

        )
    }
}

export default connect(
    state => ({
        value: state.ui.messagesInputs[state.ui.selectedChat],
        isMember: state.db.chats[state.ui.selectedChat].isMember
    }),
    dispatch => ({
        send: message => dispatch(sendClick(message)),
        inputChange: value => dispatch(messageInputChange(value))
    })
)(MessageInput)