import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userSelect } from '../actions/frontend'
import Avatar from './Avatar'
import ExitMenu from './ExitMenu'

class AccountClass extends Component {

    render() {
        const {user} = this.props

        if (!user)
            return null

        const {name, surname, avatar} = user

        return (
            <div className="account">
                <div className="avatar">
                    <Avatar src={avatar}/>
                </div>
                <div className="info">
                    <div className="name">
                        {name} {surname}
                    </div>
                    <div className="menu-area">
                        <div className="link">Online</div>
                        <ExitMenu />
                    </div>
                </div>
            </div>
        )
    }
}

class InviteAccountClass extends Component {

    render() {
        const {user, select, checked} = this.props
        if (!user)
            return null

        const {name, surname, avatar, username} = user
        return (
            <li className="account">
                <label>
                    <input type='checkbox' className="check"
                           onChange={select} checked={checked}/>
                    <div className="custom"/>
                    <div className="avatar">
                        <Avatar src={avatar}/>
                    </div>
                    <div className="info-fix">
                        <div className="name">
                            {name} {surname}
                        </div>
                        <div className="link">
                            @{username}
                        </div>
                    </div>
                </label>
            </li>
        )
    }
}

export const Account = connect(
    state => ({
        user: state.db.users[state.ui.loggedAccount]
    }),
    dispatch => ({})
)(AccountClass)

export const InviteAccount = connect(
    (state, ownProps) => ({
        checked: !!state.ui.selectedUsers[ownProps.userId],
        user: state.db.users[ownProps.userId]
    }),
    (dispatch, ownProps) => ({
        select: () => dispatch(userSelect(ownProps.userId))
    })
)(InviteAccountClass)