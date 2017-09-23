import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signUpClick, switchClick } from '../actions/frontend'

class SignUp extends Component {

    constructor(props) {
        super()

        this.state = {
            passwordsEqual: true
        }

        this.nameInput = ''
        this.surnameInput = ''
        this.usernameInput = ''
        this.passwordInput = ''
        this.confirmPassInput = ''
        this.avatarInput = ''
        this.descInput = ''
        this.handleClick = this.handleClick.bind(this)
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleConfirmPassChange = this.handleConfirmPassChange.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleSurnameChange = this.handleSurnameChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
        this.handleAvatarChange = this.handleAvatarChange.bind(this)
    }

    handleClick() {
        const {signUp} = this.props

        if (this.passwordInput === this.confirmPassInput)
            signUp(
                this.nameInput,
                this.surnameInput,
                this.usernameInput,
                this.passwordInput,
                this.avatarInput,
                this.descInput)
    }

    handleUsernameChange(e) {
        this.usernameInput = e.target.value
    }

    handlePasswordChange(e) {
        this.passwordInput = e.target.value
        this.setState({
            passwordsEqual: this.passwordInput === this.confirmPassInput
        })
    }

    handleConfirmPassChange(e) {
        this.confirmPassInput = e.target.value
        this.setState({
            passwordsEqual: this.passwordInput === this.confirmPassInput
        })
    }

    handleNameChange(e) {
        this.nameInput = e.target.value
    }

    handleSurnameChange(e) {
        this.surnameInput = e.target.value
    }

    handleDescChange(e) {
        this.descInput = e.target.value
    }

    handleAvatarChange(e) {
        this.avatarInput = e.target.value
    }

    render() {
        const {toSignIn} = this.props

        return (
            <form className="main">
                <label>
                    Name: <input type="text" autoComplete="off"
                                 onChange={this.handleNameChange}/>
                </label>
                <label>
                    Surname: <input type="text" autoComplete="off"
                                    onChange={this.handleSurnameChange}/>
                </label>
                <label>
                    Username: <input type="text" autoComplete="off"
                                     onChange={this.handleUsernameChange}/>
                </label>
                <label>
                    Password: <input type="password" autoComplete="off"
                                     onChange={this.handlePasswordChange}/>
                </label>
                <label>
                    Confirm password: <input type="password" autoComplete="off" id="confirm"
                                             style={{
                                                 boxShadow: this.state.passwordsEqual
                                                     ? ''
                                                     : '0 0 10px 0 rgba(244, 67, 54, 0.65)'
                                             }}
                                             onChange={this.handleConfirmPassChange}/>
                </label>
                <label>
                    Avatar: <input type="url" autoComplete="off"
                                   onChange={this.handleAvatarChange}/>
                </label>
                <label>
                    Description: <input type="text" autoComplete="off"
                                        onChange={this.handleDescChange}/>
                </label>
                <div className="buttons">
                    <div className="btn"
                         onClick={this.handleClick}>
                        Sign Up
                    </div>
                    <div className="btn switch-btn" onClick={toSignIn}>
                        Switch
                    </div>
                </div>
            </form>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        toSignIn: () => dispatch(switchClick()),
        signUp: (name, surname, username, password, avatar, desc) =>
            dispatch(signUpClick(name, surname, username, password, avatar, desc))
    })
)(SignUp)