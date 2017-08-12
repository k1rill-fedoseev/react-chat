import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userSelect } from '../actions/frontend'

class AccountClass extends Component {

    render() {
        const {name, surname, avatar} = this.props
        return (
            <div className="account">
                <div className="avatar">
                    <img src={avatar} alt="" width={40} height={40}/>
                </div>
                <div className="info">
                    <div className="name">
                        {name} {surname}
                    </div>
                    <div className="link">Online</div>
                </div>
            </div>
        )
    }
}

class InviteAccountClass extends Component {

    render() {
        const {user, select, checked} = this.props
        const {id, name, surname, avatar, username} = user
        return (
            <li className="account">
                <label>
                    <input type='checkbox' className="check" id={id}
                           onChange={select} checked={checked}/>
                    <div className="custom"/>
                    <div className="avatar">
                        <img src={avatar} alt="" width={40} height={40}/>
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
    state => state.account,
    dispatch => ({})
)(AccountClass)

export const InviteAccount = connect(
    state => ({}),
    (dispatch, ownProps) => ({
        select: () => dispatch(userSelect(ownProps.user.id, ownProps.user.username))
    })
)(InviteAccountClass)