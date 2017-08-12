import React, { Component } from 'react'
import { connect } from 'react-redux'
import { newClick } from '../actions/frontend'

class NewChatBtn extends Component {

    render() {
        const {phase, onClick} = this.props
        return (
            <div className="btn" onClick={onClick}>
                {phase > 4 ? 'Back' : 'New'}
            </div>
        )
    }
}

export default connect(
    state => ({
        phase: state.phase
    }),
    dispatch => ({
        onClick: () => dispatch(newClick())
    })
)(NewChatBtn)