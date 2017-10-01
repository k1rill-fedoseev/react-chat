import React, { Component } from 'react'
import { Account } from './Account'
import { connect } from 'react-redux'
import ChatsList from './ChatsList'
import NewChatTab from './NewChatTab'
import InviteTab from './InviteTab'
import SignIn from './SignIn'
import SignUp from './SignUp'
import Error from './Error'
import MainTab from './MainTab'

class App extends Component {

    render() {
        const {isLogged, isSignInTab, newChatTab, inviteTab, isChatSelected} = this.props

        if (isLogged)
            return (
                <div>
                    <div className="header">
                        <Account />
                    </div>
                    <div className="content">
                        <ChatsList />
                        {newChatTab
                            ? <NewChatTab />
                            : isChatSelected && <MainTab/>}
                        {(newChatTab || inviteTab) && <InviteTab />}
                    </div>
                    <Error />
                </div>
            )

        return (
            <div>
                <div className="header"/>
                <div className="content">
                    {isSignInTab
                        ? <SignIn />
                        : <SignUp />
                    }
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
