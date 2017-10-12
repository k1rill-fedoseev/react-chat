import React, { Component } from 'react'

export default class ProfileField extends Component {

    render() {
        const {label, value} = this.props

        return (
            <div className="smart-input no-click">
                <span className="label">{label}: </span>
                <span className="static-label">{value}</span>
            </div>
        )
    }
}