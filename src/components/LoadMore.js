import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadMoreClick } from '../actions/frontend'

class LoadMore extends Component {

    constructor(props) {
        super()

        this.handleClick = this.handleClick.bind(this)
        this.state = {
            points: 0
        }
    }

    handleClick() {
        const {loadMore, isLoading} = this.props

        if(!isLoading)
            loadMore()
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props) {
        const {isLoading} = props

        clearInterval(this.intevalId)

        if (isLoading) {
            this.intevalId = setInterval(() => {
                this.setState((prevState) => ({
                    points: (prevState.points + 1) % 4
                }))
            }, 500)
        }
    }

    componentWillUnmount() {
        clearInterval(this.intevalId)
    }

    render() {
        const {isLoading} = this.props

        return (
            <li className="loading" onClick={this.handleClick}>
                <span className="load-more">
                    {isLoading
                        ? 'Loading'
                        : 'Load more'}
                    {isLoading && <i className="points">{'.'.repeat(this.state.points)}</i>}
                </span>
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