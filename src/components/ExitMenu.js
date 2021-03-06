import React, { Component } from 'react'
import { connect } from 'react-redux'
import { exitClick, openProfileClick } from '../actions/frontend'

class ExitMenu extends Component {

    render() {
        const {exit, openProfile} = this.props

        return (
            <div className="exit-menu">
                <div className="exit-menu-btn" onClick={openProfile}>Profile</div>
                <div className="exit-menu-btn" onClick={exit}>Exit</div>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        exit: () => dispatch(exitClick()),
        openProfile: () => dispatch(openProfileClick())
    })
)(ExitMenu)