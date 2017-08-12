import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signUpClick, switchClick } from '../actions/frontend'

class SignUp extends Component {

    constructor(props) {
        super(props)
        this.inputs = {
            nameInput: '',
            surnameInput: '',
            usernameInput: '',
            passwordInput: '',
            confirmPassInput: '',
            avatarInput: '',
            descInput: ''
        }
    }

    render() {
        const {signUp, toSignIn} = this.props
        const {inputs} = this
        return (
            <form className="main">
                <label>
                    Name: <input type="text" autoComplete="off"
                                 onChange={(e) => inputs.nameInput = e.target.value}/>
                </label>
                <label>
                    Surname: <input type="text" autoComplete="off"
                                    onChange={(e) => inputs.surnameInput = e.target.value}/>
                </label>
                <label>
                    Username: <input type="text" autoComplete="off"
                                     onChange={(e) => inputs.usernameInput = e.target.value}/>
                </label>
                <label>
                    Password: <input type="password" autoComplete="off"
                                     onChange={(e) => {
                                         inputs.passwordInput = e.target.value
                                         e.target.form[4]//ля, как же я люблю костыли, просто обожаю
                                             .style.boxShadow = inputs.confirmPassInput === inputs.passwordInput ?
                                             '' : '0px 0px 10px 0px rgba(244, 67, 54, 0.65)'
                                     }}/>
                </label>
                <label>
                    Confirm password: <input type="password" autoComplete="off"
                                             onChange={(e) => {
                                                 this.inputs.confirmPassInput = e.target.value
                                                 e.target.style.boxShadow =
                                                     inputs.confirmPassInput === inputs.passwordInput ?
                                                         '' : '0px 0px 10px 0px rgba(244, 67, 54, 0.65)'
                                             }}/>
                </label>
                <label>
                    Avatar: <input type="url" autoComplete="off"
                                   onChange={(e) => inputs.avatarInput = e.target.value}/>
                </label>
                <label>
                    Description: <input type="text" autoComplete="off"
                                        onChange={(e) => inputs.descInput = e.target.value}/>
                </label>
                <div className="buttons">
                    <div className="btn"
                         onClick={() => {
                             if (inputs.passwordInput === inputs.confirmPassInput)
                                 signUp(
                                     inputs.nameInput,
                                     inputs.surnameInput,
                                     inputs.usernameInput,
                                     inputs.passwordInput,
                                     inputs.avatarInput,
                                     inputs.descInput)
                         }}>
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