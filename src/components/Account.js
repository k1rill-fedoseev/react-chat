import React, { Component } from 'react'
import { connect } from 'react-redux'
import { removeUserClick, userSelect } from '../actions/frontend'
import Avatar from './Avatar'
import ExitMenu from './ExitMenu'

class AccountClass extends Component {

    render() {
        const {user} = this.props

        if (!user)
            return null

        const {name, surname, avatar, id} = user

        return (
            <div className="account">
                <Avatar src={avatar}  userId={id}/>
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

export class ProfileAccount extends Component {

    render() {
        const {name, surname, avatar, username} = this.props.user

        return (
            <div className="account">
                <Avatar src={avatar}/>
                <div className="info-fix">
                    <div className="name">
                        {name} {surname}
                    </div>
                    <div className="link">
                        @{username}
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

        const {name, surname, avatar, username, id} = user
        return (
            <li className="account">
                <label>
                    <input type="checkbox" className="check"
                           onChange={select} checked={checked}/>
                    <div className="custom"/>
                    <Avatar src={avatar} userId={id}/>
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

class MemberAccountClass extends Component {

    render() {
        const {user, invitedBy, isCreator, isRemovable, removeUser} = this.props

        if (!user || (!invitedBy && !isCreator))
            return null

        const {name, surname, avatar, username, id} = user

        return (
            <li className="account">
                <Avatar src={avatar} userId={id}/>
                <div className="info-fix">
                    <div className="name">
                        {name} {surname}
                    </div>
                    <div className="link">
                        @{username}
                    </div>
                </div>
                <div className="invited-by">
                    {isCreator
                        ? 'Created the chat'
                        : `Invited by ${invitedBy.name} ${invitedBy.surname}`}
                </div>
                {!isCreator && isRemovable && <span className="confirm-delete" onClick={removeUser}>&#61460;</span>}
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

export const MemberAccount = connect(
    (state, ownProps) => {
        const isCreator = ownProps.userId === ownProps.creatorId

        return {
            user: state.db.users[ownProps.userId],
            invitedBy: state.db.users[ownProps.invitedById],
            isCreator,
            isRemovable: state.ui.loggedAccount === ownProps.invitedById || state.ui.loggedAccount === ownProps.creatorId
        }
    },
    (dispatch, ownProps) => ({
        removeUser: () => dispatch(removeUserClick(ownProps.userId))
    })
)(MemberAccountClass)