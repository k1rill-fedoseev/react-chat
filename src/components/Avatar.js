import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openProfileClick } from '../actions/frontend'

class Avatar extends Component {

    render() {
        const {src, title, openProfile} = this.props

        return (
            <div className="avatar" onClick={openProfile}>
                <img alt="" width={40} height={40} src={src} title={title}/>
            </div>
        )
    }
}

export default connect(
    (state, ownProps) => ({}),
    (dispatch, ownProps) => ({
        openProfile: () => ownProps.userId && dispatch(openProfileClick(ownProps.userId))
    })
)(Avatar)