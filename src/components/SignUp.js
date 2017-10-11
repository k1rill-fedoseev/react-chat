import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signUpClick, switchClick } from '../actions/frontend'
import Form from './Form'
import Input from './Input'

class SignUp extends Component {

    constructor(props) {
        super()

        this.state = {
            isAllValid: false
        }

        this.values = {}

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleClick() {
        const {signUp} = this.props
        const {isAllValid} = this.state
        const {name, surname, username, password, confirm, avatar, description} = this.values

        if (isAllValid && password === confirm)
            signUp(name, surname, username, password, avatar, description)
    }

    handleChange(values, isAllValid) {
        this.values = values
        this.setState({
            isAllValid
        })
    }

    render() {
        const {toSignIn} = this.props
        const {isAllValid} = this.state

        return (
            <Form onChange={this.handleChange}>
                <Input name="name" label="Name" minLength={2} maxLength={16}/>
                <Input name="surname" label="Surname" minLength={2} maxLength={16}/>
                <Input name="username" label="Username" minLength={1} maxLength={20}/>
                <Input name="password" label="Password" type="password" minLength={3} maxLength={128}/>
                <Input name="confirm" label="Confirm password" type="password" minLength={3} maxLength={128} equalTo="password"/>
                <Input name="avatar" label="Avatar" maxLength={256}/>
                <Input name="description" label="Description" maxLength={256}/>
                <div className="buttons">
                    <div className={`btn ${isAllValid
                        ? ''
                        : 'disabled'}`} onClick={this.handleClick}>
                        Sign Up
                    </div>
                    <div className="btn switch-btn" onClick={toSignIn}>
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
        toSignIn: () => dispatch(switchClick()),
        signUp: (name, surname, username, password, avatar, description) =>
            dispatch(signUpClick(name, surname, username, password, avatar, description))
    })
)(SignUp)