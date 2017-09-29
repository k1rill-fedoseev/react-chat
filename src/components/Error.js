import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearError } from '../actions/frontend'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const transitionSettings = {
    transitionName: 'drop-menu',
    transitionEnter: false,
    transitionLeave: true,
    transitionLeaveTimeout: 500
}

class Error extends Component {

    componentWillReceiveProps() {
        const {clear} = this.props

        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(clear, 3500)
    }

    render() {
        const {error} = this.props

        return (
            <ReactCSSTransitionGroup {...transitionSettings}>
                {error &&
                <div className="error">
                    {error}
                </div>}
            </ReactCSSTransitionGroup>
        )
    }
}

export default connect(
    state => ({
        error: state.ui.error
    }),
    dispatch => ({
        clear: () => dispatch(clearError())
    })
)(Error)