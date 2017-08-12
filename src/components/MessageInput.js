import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sendClick } from '../actions/frontend'

class MessageInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            inputMessage: ''
        }
    }

    render() {
        const {send} = this.props
        return (
            <div className="input">
                <div className="fix">
                        <textarea className="text" id="mes-input" placeholder="Type your message ..." value={this.state.inputMessage}
                                  onChange={(e) => this.setState({inputMessage: e.target.value})}/>
                </div>
                <div id="send-btn" onClick={() => {
                    if(this.state.inputMessage.length) {
                        send(this.state.inputMessage)
                        this.setState({inputMessage: ''})
                    }
                }}/>
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