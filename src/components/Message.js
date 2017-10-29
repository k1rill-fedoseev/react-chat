import React, { Component } from 'react'
import { connect } from 'react-redux'
import Avatar from './Avatar'
import { messageSelect } from '../actions/frontend'

class Message extends Component {

    messageBlock() {
        const {select, isSelected, sender} = this.props
        const {message} = this.props.message

        return (
            <div className="message">
                {sender && sender.username === 'admin'
                    ? <div className="message-body" dangerouslySetInnerHTML={{__html: message}}/>
                    : <div className="message-body">{message}</div>}
                <span className="delete-link" onClick={select} style={isSelected && {opacity: 1}}>+</span>
            </div>
        )
    }

    messageSimpleBlock() {
        const {message} = this.props.message

        return (
            <div className="message">
                <div className="message-body">
                    {message}
                </div>
            </div>
        )
    }

    render() {
        const {sender, me, isSelected, isTemp} = this.props
        const {from} = this.props.message

        if (!from && !me)
            return (
                <li className={`mes system ${isSelected
                    ? 'temp'
                    : ''}`}>
                    {this.messageBlock()}
                </li>
            )

        if (!sender)
            return null

        const {name, surname, avatar, username, id} = sender

        return (
            <li className={`mes ${me
                ? 'me'
                : ''}
                ${isSelected || isTemp
                ? 'temp'
                : ''}`}>
                <Avatar src={avatar} title={`${name} ${surname}\n\n@${username}`} userId={id}/>
                {isTemp
                    ? this.messageSimpleBlock()
                    : this.messageBlock()}
            </li>
        )
    }
}

export default connect(
    (state, ownProps) => {
        const message = state.db.messages[ownProps.messageId]
        const isTemp = ownProps.messageId[0] === 't'
        const me = state.ui.loggedAccount === message.from || isTemp

        return {
            message,
            isTemp,
            isSelected: state.ui.selectedMessages[ownProps.messageId],
            sender: state.db.users[me
                ? state.ui.loggedAccount
                : message.from],
            me
        }
    },
    (dispatch, ownProps) => ({
        select: () => dispatch(messageSelect(ownProps.messageId))
    })
)(Message)