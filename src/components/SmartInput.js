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
        this.setState(state => ({
            isChanging: !state.isChanging
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
        const {label, value} = props
        const {isChanging, isValid} = state

        if (isChanging)
            return (
                <div className="smart-input">
                    <span className="label" onClick={this.handleClick}>{label}: </span>
                    <div className="wrapper">
                        <Input value={state.value} minLength={1} maxLength={30} onChange={this.handleChange}/>
                        {isValid && value !== state.value && <span className="fa" onClick={this.handleAccept}>&#61504;</span>}
                    </div>
                </div>
            )

        return (
            <div className="smart-input" onClick={this.handleClick}>
                {label}: <span className="static-label">{value}</span>
            </div>
        )
    }
}