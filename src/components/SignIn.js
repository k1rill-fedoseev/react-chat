import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signInClick, switchClick } from '../actions/frontend'

class SignIn extends Component {

    constructor(props) {
        super()

        this.usernameInput = ''
        this.passwordInput = ''
        this.handleClick = this.handleClick.bind(this)
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    handleClick() {
        const {signIn} = this.props

        signIn(this.usernameInput, this.passwordInput)
    }

    handleUsernameChange(e) {
        this.usernameInput = e.target.value
    }

    handlePasswordChange(e) {
        this.passwordInput = e.target.value
    }

    render() {
        const {toSignUp} = this.props

        return (
            <form className="main">
                <label>
                    Username: <input type="text" autoComplete="off"
                                     onChange={this.handleUsernameChange}/>
                </label>
                <label>
                    Password: <input type="password" autoComplete="off"
                                     onChange={this.handlePasswordChange}/>
                </label>
                <div className="buttons">
                    <div className="btn" onClick={this.handleClick}>
                        Sign In
                    </div>
                    <div className="btn switch-btn" onClick={toSignUp}>
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
        toSignUp: () => dispatch(switchClick()),
        signIn: (username, password) => dispatch(signInClick(username, password))
    })
)(SignIn)