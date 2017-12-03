import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createClick, swapClick } from '../actions/frontend'
import UserCard from './UserCard'
import Form from './Form'
import Input from './Input'
import FileInput from './FileInput'

class NewChatTab extends Component {

    constructor(props) {
        super()

        this.state = {
            isAllValid: true
        }

        this.values = {}

        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleClick() {
        const {create, isRoomCreateTab} = this.props
        const {isAllValid} = this.state
        const {name, description, avatar} = this.values

        if (!isRoomCreateTab || isAllValid)
            create(name, description, avatar)
    }

    handleChange(values, isAllValid) {
        this.values = values
        this.setState({
            isAllValid
        })
    }

    userCardsList() {
        const {selectedUsers} = this.props

        return selectedUsers.map((
            userId => <UserCard key={userId} userId={userId}/>
        ))
    }

    render() {
        const {isRoomCreateTab, swap, selectedUsers} = this.props
        const {isAllValid} = this.state

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
                <Form onChange={this.handleChange}>
                    {isRoomCreateTab && <Input name="name" label="Name" minLength={1} maxLength={30}/>}
                    {isRoomCreateTab && <Input name="description" label="Description" maxLength={256}/>}
                    {isRoomCreateTab && <FileInput name="avatar" label="Avatar"/>}
                    {!!selectedUsers.length &&
                    <label className="card-row">
                        Users: {this.userCardsList()}
                    </label>}
                    <div className={`btn ${!isRoomCreateTab || isAllValid
                        ? ''
                        : 'disabled'}`} onClick={this.handleClick}>
                        Create
                    </div>
                </Form>
            </div>
        )
    }
}

export default connect(
    state => ({
        isRoomCreateTab: state.ui.isRoomCreateTab,
        selectedUsers: Object.keys(state.ui.selectedUsers)
    }),
    dispatch => ({
        create: (name, description, avatar) => dispatch(createClick(name, description, avatar)),
        swap: () => dispatch(swapClick())
    })
)(NewChatTab)