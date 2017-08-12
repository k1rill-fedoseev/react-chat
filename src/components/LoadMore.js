import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadMoreClick } from '../actions/frontend'

class LoadMore extends Component {

    constructor(props) {
        super(props)
        this.state = {
            points: 0
        }
    }

    componentWillMount() {
        this.componentWillReceiveProps()
    }

    componentWillReceiveProps(props = this.props) {
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
        const {isLoading, onClick} = this.props
        return (
            <li className="loading" onClick={onClick}>
                <span className="load-more">
                    {isLoading ? 'Loading' : 'Load more'}
                    {isLoading && <i className="points">{'.'.repeat(this.state.points)}</i>}
                </span>
            </li>
        )
    }
}

export default connect(
    state => ({
        isLoading: state.activeChat.isLoading
    }),
    dispatch => ({
        onClick: () => {
            dispatch(loadMoreClick())
        }
    })
)(LoadMore)