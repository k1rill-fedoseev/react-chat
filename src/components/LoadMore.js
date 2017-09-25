import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadMoreClick } from '../actions/frontend'
import EllipsisText from './EllipsisText'

class LoadMore extends Component {

    constructor(props) {
        super()

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        const {loadMore, isLoading} = this.props

        if (!isLoading)
            loadMore()
    }

    render() {
        const {isLoading} = this.props

        return (
            <li className="loading" onClick={this.handleClick}>
                {isLoading
                    ? <EllipsisText fixed text='Loading'/>
                    : 'Load more'
                }
            </li>
        )
    }
}

export default connect(
    state => ({
        isLoading: state.db.chats[state.ui.selectedChat].isLoading
    }),
    dispatch => ({
        loadMore: () => {
            dispatch(loadMoreClick())
        }
    })
)(LoadMore)