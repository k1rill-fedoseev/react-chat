import React, { Component } from 'react'

export default class FileInput extends Component {

    constructor(props) {
        super()

        this.state = {
            isValid: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
            isValid: e.target.files.length === 1
        })
    }

    handleClick(e) {
        const {onAccept} = this.props
        const {file} = this.state

        e.preventDefault()

        onAccept(file)
    }

    render() {
        const {label} = this.props
        const {isValid} = this.state

        return (
            <div className="smart-input">
                <span className="label">{label}:</span>
                <label>
                    <input type="file" accept="image/png, image/jpg/, image/jpeg"
                           onChange={this.handleChange}/>
                    {isValid && <span className="fa" onClick={this.handleClick}>&#61504;</span>}
                </label>
            </div>
        )
    }
}