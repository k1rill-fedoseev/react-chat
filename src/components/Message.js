import React, { Component } from 'react'

class Message extends Component {

    render() {
        const {id, me, system, avatar, message, tempId} = this.props.message
        return (
            <li className={"mes " + (system ? "system " : me ? "me " : "") + (tempId ? "temp" : "")} id={id}>
                {!system &&
                <div className="avatar">
                    <img src={avatar} alt="" width={40} height={40}/>
                </div>}
                <div className="message">
                    <div className="mes-text">
                        {message}
                    </div>
                </div>
            </li>
        )
    }
}

export default Message