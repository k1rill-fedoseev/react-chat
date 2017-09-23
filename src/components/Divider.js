import React, { Component } from 'react'
import { connect } from 'react-redux'

class Divider extends Component {

    render() {
        const {text} = this.props

        return (
            <li className="divider">{text}</li>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({})
)(Divider)