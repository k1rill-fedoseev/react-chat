import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createClick, swapClick } from '../actions/frontend'
import UserCard from './UserCard'

class NewChatTab extends Component {

    constructor(props) {
        super(props)
        this.nameInput = ''
        this.descInput = ''
        this.avatarInput = ''
    }

    render() {
        const {phase, createChat, swap, usersSelected} = this.props
        return (
            <div id="new-chat">
                <div className="up-line">
                    <div className="title">
                        Create new {phase === 5 ? 'room' : '1-to-1 chat'} <span className="quot">(</span>
                        <span id="next" onClick={swap}>
                            {phase === 6 ? 'room' : '1-to-1 chat'}
                        </span>
                        <span className="quot">)</span>
                    </div>
                </div>
                <form className="main">
                    {phase === 5 &&
                    <label>
                        Name: <input type="text" autoComplete="off"
                                     onChange={(e) => this.nameInput = e.target.value}/>
                    </label>}
                    {phase === 5 &&
                    <label>
                        Description: <input type="text" autoComplete="off"
                                            onChange={(e) => this.descInput = e.target.value}/>
                    </label>}
                    {phase === 5 &&
                    <label>
                        Photo: <input type="url" autoComplete="off"
                                      onChange={(e) => this.avatarInput = e.target.value}/>
                    </label>
                    }
                    {!!usersSelected.length &&
                    <label className="card-row">
                        Users: {usersSelected.map((
                        user => (<UserCard key={user.id} user={user}/>)
                    ))}
                    </label>}
                    <div className="btn" onClick={phase === 7 ?
                        createChat :
                        () => createChat(this.nameInput, this.descInput, this.avatarInput)}>
                        Create
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(
    state => ({
        phase: state.phase,
        usersSelected: state.usersSelected
    }),
    dispatch => ({
        createChat: (name, desc, avatar) => dispatch(createClick(name, desc, avatar)),
        swap: () => dispatch(swapClick())
    })
)(NewChatTab)