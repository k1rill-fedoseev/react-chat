import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userSelect } from '../actions/frontend'

class UserCard extends Component {

    render() {
        const {user, remove} = this.props

        return (
            <div className="card" onClick={remove}>
                @{user.username}
            </div>
        )
    }
}

export default connect(
    (state, ownProps) => ({
        user: state.db.users[ownProps.userId]
    }),
    (dispatch, ownProps) => ({
        remove: () => dispatch(userSelect(ownProps.userId))
    })
)(UserCard)