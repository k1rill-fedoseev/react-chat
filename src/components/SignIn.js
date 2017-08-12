import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signInClick, switchClick } from '../actions/frontend'

class SignIn extends Component {

    constructor(props) {
        super(props)
        this.usernameInput = ''
        this.passwordInput = ''
    }

    render() {
        const {toSignUp, signIn} = this.props
        return (
            <form className="main">
                <label>
                    Username: <input type="text" autoComplete="off"
                                     onChange={(e) => this.usernameInput = e.target.value}/>
                </label>
                <label>
                    Password: <input type="password" autoComplete="off"
                                     onChange={(e) => this.passwordInput = e.target.value}/>
                </label>
                <div className="buttons">
                    <div className="btn" onClick={() => signIn(this.usernameInput, this.passwordInput)}>
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
    state => ({
        phase: state.phase
    }),
    dispatch => ({
        toSignUp: () => dispatch(switchClick()),
        signIn: (username, password) => dispatch(signInClick(username, password))
    })
)(SignIn)