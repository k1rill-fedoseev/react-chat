import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ProfileAccount } from './Account'
import {
    changeUserInfoClick, closeProfileClick, USER_AVATAR,
    USER_DESCRIPTION, USER_PASSWORD
} from '../actions/frontend'
import SmartInput from './SmartInput'
import SmartPasswordInput from './SmartPasswordInput'

class UserProfile extends Component {

    render() {
        const {user, close, changeAvatar, changeDescription, changePassword} = this.props
        const {avatar, description} = user

        return (
            <div id="add-user">
                <div className="up-line">
                    <div className="title">Profile</div>
                    <div className="close" onClick={close}>+</div>
                </div>
                <div className="profile">
                    <ProfileAccount user={user}/>
                    <SmartInput label="Avatar" maxLength={256} value={avatar === undefined ? '' : avatar} onAccept={changeAvatar}/>
                    <SmartInput label="Description" maxLength={256} value={description === undefined ? '' : description} onAccept={changeDescription}/>
                    <SmartPasswordInput onAccept={changePassword}/>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.db.users[state.ui.userProfile]
    }),
    dispatch => ({
        close: () => dispatch(closeProfileClick()),
        changeAvatar: value => dispatch(changeUserInfoClick(USER_AVATAR, value)),
        changeDescription: value => dispatch(changeUserInfoClick(USER_DESCRIPTION, value)),
        changePassword: (value, oldPassword) => dispatch(changeUserInfoClick(USER_PASSWORD, value, oldPassword))
    })
)(UserProfile)