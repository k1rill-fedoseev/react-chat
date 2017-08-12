import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userSelect } from '../actions/frontend'

class UserCard extends Component {

    render() {
        const {user, onClick} = this.props
        return (
            <div className="card" onClick={onClick}>
                @{user.username}
            </div>
        )
    }
}

export default connect(
    state => ({}),
    (dispatch, ownProps) => ({
        onClick: () => dispatch(userSelect(ownProps.user.id))
    })
)(UserCard)