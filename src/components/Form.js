import React, { Component } from 'react'
import Input from './Input'
import FileInput from './FileInput'

export default class Form extends Component {

    constructor(props) {
        const {children} = props

        super()

        this.state = {
            values: {},
            validStatus: {}
        }

        this.validCount = 0
        this.inputsCount = 0

        React.Children.forEach(children, child => {
            if (child && (child.type === Input || child.type === FileInput))
                this.inputsCount++
        })
    }

    handleInputChange(name, value, isValid) {
        const {onChange} = this.props
        const {validStatus} = this.state

        if (validStatus[name] ^ isValid) {
            this.validCount += isValid
                ? 1
                : -1
            this.setState(state => ({
                validStatus: {
                    ...state.validStatus,
                    [name]: isValid
                }
            }))
        }

        this.setState(state => ({
            values: {
                ...state.values,
                [name]: value
            }
        }), () => {
            onChange(this.state.values, this.validCount === this.inputsCount)
        })
    }

    children() {
        const {children} = this.props
        const {values} = this.state

        return React.Children.map(
            children,
            child => {
                if (child) {
                    if (child.type === Input)
                        return React.cloneElement(child, {
                            onChange: (value, status) =>
                                this.handleInputChange(child.props.name, value, status),
                            value: values[child.props.name] || '',
                            match: values[child.props.equalTo]
                        })
                    if (child.type === FileInput) {
                        return React.cloneElement(child, {
                            onChange: (value, status) =>
                                this.handleInputChange(child.props.name, value, status)
                        })
                    }
                }
                return child
            }
        )
    }

    shouldComponentUpdate(props) {
        return props !== this.props
    }

    render() {
        return (
            <form className="main">
                {this.children()}
            </form>
        )
    }
}