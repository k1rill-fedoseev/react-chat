import React, { Component } from 'react'

export default class Avatar extends Component {

    render() {
        return (
            <img alt="" width={40} height={40} {...this.props}/>
        )
    }
}