import React, { Component } from 'react'
import Input from './Input'
import { connect } from 'react-redux'
import { signInClick, switchClick } from '../actions/frontend'
import Form from './Form'

class SignIn extends Component {

    constructor(props) {
        super()

        this.state = {
            isAllValid: false
        }

        this.values = {}

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(values, isAllValid) {
        this.values = values
        this.setState({
            isAllValid
        })
    }

    handleClick() {
        const {signIn} = this.props
        const {isAllValid} = this.state
        const {username, password} = this.values

        if (isAllValid)
            signIn(username, password)
    }

    render() {
        const {toSignUp} = this.props
        const {isAllValid} = this.state

        return (
            <Form onChange={this.handleChange}>
                <Input name="username" label="Username" minLength={1} maxLength={20}/>
                <Input name="password" label="Password" minLength={3} maxLength={128}/>
                <div className="buttons">
                    <div className={`btn ${isAllValid
                        ? ''
                        : 'disabled'}`} onClick={this.handleClick}>
                        Sign In
                    </div>
                    <div className="btn switch-btn" onClick={toSignUp}>
                        Switch
                    </div>
                </div>
            </Form>
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