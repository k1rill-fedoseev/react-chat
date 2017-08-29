import React, { Component } from 'react'
import { connect } from 'react-redux'

export default class Divider extends Component {
    render() {
        const {text} = this.props
        return (
            <li className="divider">{text}</li>
        )
    }
}