import React, { Component } from 'react'

export default class Input extends Component {

    constructor(props) {
        super()

        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        const {minLength = 0, match, value, onChange} = this.props

        this.isValid = minLength === 0 && !match

        if (this.isValid)
            onChange(value, this.isValid)
    }

    validate(value, props = this.props) {
        const {equalTo, match, minLength = 0, maxLength = Infinity} = props

        return (!equalTo || match === value) && value.length >= minLength && value.length <= maxLength
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
        const {label, type, value} = this.props

        return (
            <label>
                {label}: <input type={type} autoComplete="off" value={value}
                                onChange={this.handleChange}
                                style={{
                                    boxShadow: this.isValid
                                        ? ''
                                        : '0 0 10px 0 rgba(244, 67, 54, 0.65)'
                                }}/>
            </label>)
    }
}