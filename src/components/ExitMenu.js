import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exitClick } from '../actions/frontend'

class ExitMenu extends Component {

    render() {
        const {exit} = this.props

        return (
            <div className="exit-menu">
                <div className="exit-menu-btn" onClick={exit}>Exit</div>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        exit: () => dispatch(exitClick())
    })
)(ExitMenu)