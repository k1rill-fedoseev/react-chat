import React, { Component } from 'react'
import Input from './Input'
import Form from './Form'

export default class SmartInput extends Component {

    constructor(props) {
        super()

        this.state = {
            isChanging: false,
            oldPassword: '',
            newPassword: '',
            confirm: '',
            isValid: false
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAccept = this.handleAccept.bind(this)
    }

    handleClick() {
        this.setState(state => ({
            isChanging: !state.isChanging,
            oldPassword: '',
            newPassword: '',
            confirm: '',
            isValid: false
        }))
    }

    handleChange(values, isValid) {
        this.setState({...values, isValid})
    }

    handleAccept() {
        const {onAccept} = this.props
        const {newPassword, oldPassword} = this.state

        onAccept(newPassword, oldPassword)
        this.handleClick()
    }

    render() {
        const {isChanging, isValid} = this.state

        if (isChanging)
            return (
                <div className="smart-password-change">
                    <Form onChange={this.handleChange}>
                        <Input type="password" name="oldPassword" label="Old password" minLength={3}
                               maxLength={128}/>
                        <Input type="password" name="newPassword" label="New password" minLength={3}
                               maxLength={128}/>
                        <Input type="password" name="confirm" label="Confirm password" minLength={3} maxLength={128}
                               equalTo="newPassword">
                            {isValid &&
                            <span className="fa" onClick={this.handleAccept}>&#61504;</span>}
                        </Input>
                    </Form>
                </div>
            )

        return (
            <div className="smart-input" onClick={this.handleClick}>
                <span className="label">Password: </span>
                <span className="static-label">******</span>
            </div>
        )
    }
}