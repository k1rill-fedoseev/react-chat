import React, { Component } from 'react'
import { connect } from 'react-redux'

class EllipsisText extends Component {

    constructor(props) {
        super()

        this.state = {
            points: 0
        }
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps(props) {
        clearInterval(this.intevalId)

        this.intevalId = setInterval(() => {
            this.setState(prevState => ({
                points: (prevState.points + 1) % 4
            }))
        }, 500)
    }

    componentWillUnmount() {
        clearInterval(this.intevalId)
    }

    render() {
        const {fixed, text} = this.props
        const points = '.'.repeat(this.state.points)

        return (
            <span className="ellipsis-text">
                {text}
                {!fixed && points}
                {fixed && <span className="fixed-points">{points}</span>}
            </span>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({})
)(EllipsisText)