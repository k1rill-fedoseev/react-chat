import React, { Component } from 'react'

export default class FileInput extends Component {

    constructor(props) {
        super()

        this.handleChange = this.handleChange.bind(this)
    }

    componentWillMount() {
        const {onChange} = this.props

        onChange(undefined, true)
    }

    handleChange(e) {
        const {onChange} = this.props

        onChange(e.target.files[0], true)
    }

    render() {
        const {label} = this.props

        return (
            <label>
                {label}: <input type="file" accept="image/png, image/jpg, image/jpeg" onChange={this.handleChange}/>
            </label>
        )
    }
}