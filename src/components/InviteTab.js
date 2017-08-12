import React, { Component } from 'react'
import { connect } from 'react-redux'
import { InviteAccount } from './Account'
import { inviteAcceptClick, inviteClick, searchChange } from '../actions/frontend'

class InviteTab extends Component {

    render() {
        const {users, phase, usersSelected, accept, cancel, fetch} = this.props
        return (
            <div id="add-user">
                <div className="up-line">
                    <div className="title">Invite:</div>
                    <input type="text" id="invite-input" onChange={(e) => fetch(e.target.value)}/>
                    {phase === 4 && <span id="tick" onClick={accept}>
                        &#10004;
                        <sup>
                            {usersSelected.length || null}
                        </sup>
                    </span>}
                    {phase === 4 && <div className="plus-user" onClick={cancel}>+</div>}
                </div>
                <ul id="users">
                    {users.map(user => {
                        return (<InviteAccount key={user.id} user={user}
                                               checked={usersSelected.some(userClicked => userClicked.id === user.id)}/>)
                    })}
                </ul>
            </div>
        )
    }
}

export default connect(
    state => ({
        users: state.usersSearch,
        phase: state.phase,
        usersSelected: state.usersSelected
    }),
    dispatch => ({
        fetch: (search) => dispatch(searchChange(search)),
        accept: () => dispatch(inviteAcceptClick()),
        cancel: () => dispatch(inviteClick())
    })
)(InviteTab)