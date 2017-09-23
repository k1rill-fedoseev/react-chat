import React, { Component } from 'react'
import { connect } from 'react-redux'
import Avatar from './Avatar'

class Message extends Component {

    render() {
        const {sender, me} = this.props
        const {message, from, id} = this.props.message

        if(!from && !me)
            return (
                <li className={'mes system'}>
                    <div className="message">
                        <div className="mes-text">
                            {message}
                        </div>
                    </div>
                </li>
            )

        if(!sender)
            return null

        const {name, surname, avatar, username} = sender

        return (
            <li className={`mes ${me ? 'me' : ''} ${id[0] === 't' ? 'temp' : ''}`}>
                <div className="avatar">
                    <Avatar src={avatar} title={`${name} ${surname}\n\n@${username}`}/>
                </div>
                <div className="message">
                    <div className="mes-text">
                        {message}
                    </div>
                </div>
            </li>
        )
    }
}

export default connect(
    (state, ownProps) => {
        const message = state.db.messages[ownProps.messageId]
        const me = state.ui.loggedAccount === message.from || ownProps.messageId[0] === 't'

        return {
            message: message,
            sender: state.db.users[me ? state.ui.loggedAccount : message.from],
            me
        }
    },
    dispatch => ({})
)(Message)