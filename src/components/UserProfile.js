import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ProfileAccount } from './Account'
import {
    changeUserInfoClick, closeProfileClick, USER_AVATAR,
    USER_DESCRIPTION, USER_PASSWORD
} from '../actions/frontend'
import SmartInput from './SmartInput'
import SmartPasswordInput from './SmartPasswordInput'
import ProfileField from './ProfileField'
import SmartFileInput from './SmartFileInput'

class UserProfile extends Component {

    render() {
        const {user, close, changeAvatar, changeDescription, changePassword, isMe} = this.props
        const {description} = user

        if (!isMe)
            return (
                <div id="add-user">
                    <div className="up-line">
                        <div className="title">Profile</div>
                        <div className="close" onClick={close}>+</div>
                    </div>
                    <div className="profile">
                        <ProfileAccount user={user}/>
                        <ProfileField label="Description" value={description.length === 0
                            ? '<empty>'
                            : description}/>
                    </div>
                </div>
            )

        return (
            <div id="add-user">
                <div className="up-line">
                    <div className="title">Profile</div>
                    <div className="close" onClick={close}>+</div>
                </div>
                <div className="profile">
                    <ProfileAccount user={user}/>
                    <SmartFileInput label="Avatar" onAccept={changeAvatar}/>
                    <SmartInput label="Description" maxLength={256} value={description} onAccept={changeDescription}/>
                    <SmartPasswordInput onAccept={changePassword}/>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.db.users[state.ui.userProfile],
        isMe: state.ui.loggedAccount === state.ui.userProfile
    }),
    dispatch => ({
        close: () => dispatch(closeProfileClick()),
        changeAvatar: file => dispatch(changeUserInfoClick(USER_AVATAR, file)),
        changeDescription: value => dispatch(changeUserInfoClick(USER_DESCRIPTION, value)),
        changePassword: (value, oldPassword) => dispatch(changeUserInfoClick(USER_PASSWORD, value, oldPassword))
    })
)(UserProfile)