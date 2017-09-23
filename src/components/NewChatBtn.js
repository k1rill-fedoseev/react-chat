import React, { Component } from 'react'
import { connect } from 'react-redux'
import { newClick } from '../actions/frontend'

class NewChatBtn extends Component {

    render() {
        const {newChatTab, newBtnClick} = this.props

        return (
            <div className="btn" onClick={newBtnClick}>
                {newChatTab
                    ? 'Back'
                    : 'New'}
            </div>
        )
    }
}

export default connect(
    state => ({
        newChatTab: state.ui.newChatTab
    }),
    dispatch => ({
        newBtnClick: () => dispatch(newClick())
    })
)(NewChatBtn)