import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userSelect } from '../actions/frontend'

class Avatar extends Component {

    render() {
        return (
            <img {...this.props} alt="" width={40} height={40}/>
        )
    }
}

export default connect(
    (state, ownProps) => ({}),
    (dispatch, ownProps) => ({})
)(Avatar)