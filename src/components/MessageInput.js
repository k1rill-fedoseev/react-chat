import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendClick } from '../actions/frontend'

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
        this.setState({
            inputMessage: e.target.value
        })
    }

    handleClick() {
        const {send} = this.props

        if(this.state.inputMessage.length) {
            send(this.state.inputMessage)
            this.setState({
                inputMessage: ''
            })
        }
    }

    render() {
        return (
            <div className="input">
                <div className="fix">
                        <textarea className="text" id="mes-input" placeholder="Type your message ..." value={this.state.inputMessage}
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
        send: (message) => dispatch(sendClick(message))
    })
)(MessageInput)