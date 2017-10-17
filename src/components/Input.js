import React, { Component } from 'react'
import validator from 'validator'

export default class Input extends Component {

    constructor(props) {
        super()

        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        const {value, onChange} = this.props

        this.isValid = this.validate(value)

        if (this.isValid)
            onChange(value, this.isValid)
    }

    validate(value, props = this.props) {
        const {equalTo, match, minLength, maxLength, isAlphanumeric} = props

        return (!equalTo || match === value) && validator.isLength(value, {min: minLength, max: maxLength})
            && (!isAlphanumeric || validator.isAlphanumeric(value))
    }

    componentWillReceiveProps(props) {
        const isValid = this.validate(props.value, props)

        if (this.isValid ^ isValid) {
            this.isValid = isValid
            props.onChange(props.value, this.isValid)
        }
    }

    handleChange(e) {
        const {onChange} = this.props
        const {value} = e.target

        this.isValid = this.validate(value)

        onChange(value, this.isValid)
    }

    render() {
        const {label, type, value, children} = this.props

        return (
            <label>
                {label
                    ? `${label}:`
                    : null} <input type={type} autoComplete="off" value={value}
                                   onChange={this.handleChange}
                                   style={{
                                       boxShadow: this.isValid
                                           ? ''
                                           : '0 0 10px 0 rgba(244, 67, 54, 0.65)'
                                   }}/>
                {children}
            </label>
        )
    }
}