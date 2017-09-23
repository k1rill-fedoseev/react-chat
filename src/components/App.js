import React, { Component } from 'react'
import { Account } from './Account'
import { connect } from 'react-redux'
import ChatsList from './ChatsList'
import NewChatTab from './NewChatTab'
import InviteTab from './InviteTab'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Error from './Error'
import MessagesTab from './MessagesTab'

class App extends Component {

    render() {
        const {isLogged, isSignInTab, newChatTab, inviteTab, isChatSelected} = this.props

        return (
            <div>
                <div className="header">
                    {isLogged && <Account />}
                </div>
                <div className="content">
                    {isLogged
                        ? <ChatsList />
                        : (isSignInTab
                            ? <SignIn />
                            : <SignUp />
                        )
                    }
                    {isLogged && (newChatTab
                        ? <NewChatTab />
                        : isChatSelected && <MessagesTab/>)}
                    {isLogged && (newChatTab || inviteTab) && <InviteTab />}
                </div>
                <Error />
            </div>
        )
    }
}


export default connect(
    state => ({
        isLogged: !!state.ui.loggedAccount,
        isSignInTab: state.ui.isSignInTab,
        newChatTab: state.ui.newChatTab,
        inviteTab: state.ui.inviteTab,
        isChatSelected: !!state.ui.selectedChat
    }),
    dispatch => ({})
)(App)
