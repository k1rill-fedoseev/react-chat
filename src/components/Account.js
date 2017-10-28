import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openProfileClick, removeUserClick, userSelect } from '../actions/frontend'
import Avatar from './Avatar'
import ExitMenu from './ExitMenu'
import { subscribe, unsubscribe } from '../helpers/onlineController'
import { parseMs } from '../helpers'

class AccountClass extends Component {

    render() {
        const {user} = this.props

        if (!user)
            return null

        const {name, surname, avatar, id} = user

        return (
            <div className="account">
                <Avatar src={avatar} userId={id}/>
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

    updateInterval(lastOnline) {
        clearInterval(this.intervalId)

        this.setState({
            lastOnline: Date.now() - lastOnline
        })

        this.intervalId = setInterval(() => {
            this.setState({
                lastOnline: Date.now() - lastOnline
            })
        }, 30000)
    }

    componentWillMount() {
        const {user} = this.props
        const {lastOnline} = user

        this.updateInterval(lastOnline)
    }

    componentWillReceiveProps(props) {
        const {user} = props
        const {lastOnline} = user

        this.updateInterval(lastOnline)
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    render() {
        const {user} = this.props
        const {name, surname, avatar, username, online} = user
        const {lastOnline} = this.state

        return (
            <div className="row">
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
                <div className="info2">
                    <div className={`tmblr ${online
                        ? 'online'
                        : ''}`}/>
                    {!online && <div className="time">{parseMs(lastOnline)}</div>}
                </div>
            </div>
        )
    }
}

class InviteAccountClass extends Component {

    componentWillMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props) {
        const {user, isMe} = props

        if (user && !isMe)
            subscribe(user.id, 2)
    }

    componentWillUnmount() {
        const {user, isMe} = this.props

        if (user && !isMe)
            unsubscribe(user.id, 2)
    }

    render() {
        const {user, select, checked} = this.props

        if (!user)
            return null

        const {name, surname, avatar, username, id, online} = user
        return (
            <li className="account invite">
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
                <div className="info2">
                    <div className={`tmblr ${online
                        ? 'online'
                        : ''}`}/>
                </div>
            </li>
        )
    }
}

class MemberAccountClass extends Component {

    componentWillMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props) {
        const {user, isMe} = props

        if (user && !isMe)
            subscribe(user.id, 1)
    }

    componentWillUnmount() {
        const {user, isMe} = this.props

        if (user && !isMe)
            unsubscribe(user.id, 1)
    }

    render() {
        const {user, invitedBy, isCreator, isRemovable, removeUser, openProfile} = this.props

        if (!user || (!invitedBy && !isCreator))
            return null

        const {name, surname, avatar, username, id, online} = user

        return (
            <li className="account profile-account">
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
                        : <span className="profile-link"
                                onClick={() => openProfile(invitedBy.id)}>Invited by {invitedBy.name} {invitedBy.surname}</span>}
                </div>
                {online && <div className="tmblr online"/>}
                {!isCreator && isRemovable && <span className="confirm-delete" onClick={removeUser}>&#61460;</span>}
            </li>
        )
    }
}

class SimpleMemberAccountClass extends Component {

    render() {
        const {user} = this.props

        if (!user)
            return null

        const {name, surname, avatar, username, id} = user

        return (
            <li className="account simple">
                <Avatar src={avatar} userId={id}/>
                <div className="info-fix">
                    <div className="name">
                        {name} {surname}
                    </div>
                    <div className="link">
                        @{username}
                    </div>
                </div>
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
    (state, ownProps) => {
        const user = state.db.users[ownProps.userId]

        if(!user)
            return {}

        return {
            checked: !!state.ui.selectedUsers[ownProps.userId],
            user,
            isMe: user.id === state.ui.loggedAccount
        }
    },
    (dispatch, ownProps) => ({
        select: () => dispatch(userSelect(ownProps.userId))
    })
)(InviteAccountClass)

export const MemberAccount = connect(
    (state, ownProps) => {
        const user = state.db.users[ownProps.userId]

        if(!user)
            return {}

        return {
            user,
            isMe: user.id === state.ui.loggedAccount,
            invitedBy: state.db.users[ownProps.invitedById],
            isCreator: ownProps.userId === ownProps.creatorId,
            isRemovable: ownProps.canRemove
            && (state.ui.loggedAccount === ownProps.invitedById || state.ui.loggedAccount === ownProps.creatorId)
        }
    }
    ,
    (dispatch, ownProps) => ({
        removeUser: () => dispatch(removeUserClick(ownProps.userId)),
        openProfile: userId => dispatch(openProfileClick(userId))
    })
)(MemberAccountClass)

export const SimpleMemberAccount = connect(
    (state, ownProps) => ({
        user: state.db.users[ownProps.userId]
    }),
    (dispatch, ownProps) => ({})
)(SimpleMemberAccountClass)