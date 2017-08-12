import React, { Component } from 'react'
import { Account } from './Account'
import { connect } from 'react-redux'
import ChatList from './ChatList'
import MessageList from './MessageList'
import NewChatTab from './NewChatTab'
import InviteTab from './InviteTab'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Error from './Error'

class App extends Component {

    render() {
        const {phase} = this.props
        return (
            <div>
                <div className="header">
                    {phase > 1 && <Account />}
                </div>
                <div className="content">
                    {phase === 0 && <SignIn />}
                    {phase === 1 && <SignUp />}
                    {phase > 1 && <ChatList/>}
                    {(phase > 2 && phase < 5) && <MessageList/>}
                    {phase > 4 && <NewChatTab />}
                    {phase > 3 && <InviteTab />}
                </div>
                <Error />
            </div>
        )
    }
}


export default connect(
    state => ({
        phase: state.phase
    }),
    dispatch => ({
    })
)(App)
