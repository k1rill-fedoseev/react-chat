import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createClick, swapClick } from '../actions/frontend'
import UserCard from './UserCard'

class NewChatTab extends Component {

    constructor(props) {
        super()

        this.nameInput = ''
        this.descInput = ''
        this.avatarInput = ''
        this.handleClick = this.handleClick.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleDescChange = this.handleDescChange.bind(this)
        this.handleAvatarChange = this.handleAvatarChange.bind(this)
    }

    handleClick() {
        const {create} = this.props

        create(this.nameInput, this.descInput, this.avatarInput)
    }

    handleNameChange(e) {
        this.nameInput = e.target.value
    }

    handleDescChange(e) {
        this.descInput = e.target.value
    }

    handleAvatarChange(e) {
        this.avatarInput = e.target.value
    }

    userCardsList() {
        const {selectedUsers} = this.props

        return selectedUsers.map((
            userId => <UserCard key={userId} userId={userId}/>
        ))
    }

    render() {
        const {isRoomCreateTab, swap, selectedUsers} = this.props

        return (
            <div id="new-chat">
                <div className="up-line">
                    <div className="title">
                        Create new {isRoomCreateTab
                        ? 'room '
                        : '1-to-1 chat '
                    }
                        <span className="quot">(</span>
                        <span id="next" onClick={swap}>
                            {isRoomCreateTab
                                ? '1-to-1 chat'
                                : 'room'}
                        </span>
                        <span className="quot">)</span>
                    </div>
                </div>
                <form className="main">
                    {isRoomCreateTab &&
                    <label>
                        Name: <input type="text" autoComplete="off"
                                     onChange={this.handleNameChange}/>
                    </label>}
                    {isRoomCreateTab &&
                    <label>
                        Description: <input type="text" autoComplete="off"
                                            onChange={this.handleDescChange}/>
                    </label>}
                    {isRoomCreateTab && <label>
                        Photo: <input type="url" autoComplete="off"
                                      onChange={this.handleAvatarChange}/>
                    </label>}

                    {!!selectedUsers.length &&
                    <label className="card-row">
                        Users: {this.userCardsList()}
                    </label>}
                    <div className="btn" onClick={this.handleClick}>
                        Create
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(
    state => ({
        isRoomCreateTab: state.ui.isRoomCreateTab,
        selectedUsers: state.ui.selectedUsers
    }),
    dispatch => ({
        create: (name, desc, avatar) => dispatch(createClick(name, desc, avatar)),
        swap: () => dispatch(swapClick())
    })
)(NewChatTab)