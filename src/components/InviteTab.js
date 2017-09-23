import React, { Component } from 'react'
import { connect } from 'react-redux'
import { InviteAccount } from './Account'
import { inviteAcceptClick, inviteClick, searchChange } from '../actions/frontend'

class InviteTab extends Component {

    constructor() {
        super()

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const {fetch} = this.props

        fetch(e.target.value)
    }

    inviteAccounts() {
        const {usersList, selectedUsers} = this.props

        return usersList.map(
            userId =>
                (<InviteAccount key={userId} userId={userId}
                                checked={selectedUsers.some(clickedUserId => clickedUserId === userId)}/>)
        )
    }

    render() {
        const {selectedUsers, newChatTab, accept, cancel} = this.props

        return (
            <div id="add-user">
                <div className="up-line">
                    <div className="title">Invite:</div>
                    <input type="text" id="invite-input" onChange={this.handleChange}/>
                    {!newChatTab && <span id="tick" onClick={accept}>
                        &#10004;
                        <sup>{selectedUsers.length || null}</sup>
                    </span>}
                    {!newChatTab && <div className="plus-user" onClick={cancel}>+</div>}
                </div>
                <ul id="users">
                    {this.inviteAccounts()}
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({
        newChatTab: state.ui.newChatTab,
        usersList: state.ui.usersList,
        selectedUsers: state.ui.selectedUsers
    }),
    dispatch => ({
        fetch: (search) => dispatch(searchChange(search)),
        accept: () => dispatch(inviteAcceptClick()),
        cancel: () => dispatch(inviteClick())
    })
)(InviteTab)