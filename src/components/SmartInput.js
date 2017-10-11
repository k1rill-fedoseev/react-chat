import React, { Component } from 'react'
import Input from './Input'

export default class SmartInput extends Component {

    constructor(props) {
        const {value} = props

        super()

        this.state = {
            isChanging: false,
            value,
            isValid: true
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleAccept = this.handleAccept.bind(this)
    }

    handleClick() {
        const {value} = this.props

        this.setState(state => ({
            isChanging: !state.isChanging,
            value
        }))
    }

    handleChange(value, isValid) {
        this.setState({
            value,
            isValid
        })
    }

    handleAccept() {
        const {onAccept} = this.props
        const {value} = this.state

        onAccept(value)
        this.handleClick()
    }

    render() {
        const {state, props} = this
        const {label, value, minLength, maxLength} = props
        const {isChanging, isValid} = state

        if (isChanging)
            return (
                <div className="smart-input">
                    <span className="label" onClick={this.handleClick}>{label}: </span>
                    <Input value={state.value} minLength={minLength} maxLength={maxLength}
                           onChange={this.handleChange}>
                        {isValid && value !== state.value &&
                        <span className="fa" onClick={this.handleAccept}>&#61504;</span>}
                    </Input>
                </div>
            )

        return (
            <div className="smart-input" onClick={this.handleClick}>
                <span className="label">{label}: </span>
                <span className="static-label">{value || '<empty>'}</span>
            </div>
        )
    }
}