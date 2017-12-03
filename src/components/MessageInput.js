import React, { Component } from 'react'
import { connect } from 'react-redux'
import { attachImages, deleteAttachments, messageInputChange, sendClick } from '../actions/frontend'

class MessageInput extends Component {

    constructor(props) {
        super()

        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
        this.handleFilesSelect = this.handleFilesSelect.bind(this)
    }


    handleChange(e) {
        const {inputChange} = this.props
        const {value} = e.target

        inputChange(value)
    }

    handleKeyDown(e) {
        const {inputChange, value} = this.props

        if (e.which === 13 && !e.ctrlKey) {
            this.handleClick()
            e.preventDefault()
        }
        else if (e.which === 13)
            inputChange(`${value} \n`)
    }

    handleDeleteClick() {
        const {removeAttachments} = this.props

        removeAttachments()
    }

    handleClick() {
        const {send, value, isMember, attachments, removeAttachments} = this.props

        if (isMember && (value && value.length <= 1024 || attachments.length)) {
            send(value, attachments)
            removeAttachments()

            this.textarea.focus()
        }
    }

    handleDragOver(e) {
        e.preventDefault()
    }

    addFiles(files) {
        const {attach} = this.props

        attach(Array.prototype.slice.call(files, 0, 10))
    }

    handleDrop(e) {
        e.preventDefault()

        this.addFiles(e.dataTransfer.files)
    }

    handleFilesSelect(e) {
        e.preventDefault()

        this.addFiles(e.target.files)
    }

    render() {
        const {isMember, value, attachments} = this.props

        return (
            <div className="input">
                <div className="fix">
                    {attachments.length > 0 &&
                    <div className="attachments-info-wrapper">
                        <div className="attachments-info">
                            <span className="delete-link" onClick={this.handleDeleteClick}>+</span>
                            <div className="attachments-info-text">{attachments.length}<br/>photo{attachments.length > 1
                                ? 's'
                                : ''}</div>
                        </div>
                    </div>}
                    <textarea className="text" id="mes-input" placeholder="Type your message ..."
                              value={value} onKeyDown={this.handleKeyDown} onDragOver={this.handleDragOver}
                              onDrop={this.handleDrop}
                              onChange={this.handleChange} ref={textarea => this.textarea = textarea}/>
                    {attachments.length < 10 &&
                    <label className="plus-user">+
                        <input type="file" multiple accept="image/png, image/jpg, image/jpeg" onChange={this.handleFilesSelect}/>
                    </label>}
                </div>
                <div className={`send-btn ${isMember && (value && value.length <= 1024 || attachments.length)
                    ? ''
                    : 'disabled'}`} onClick={this.handleClick}/>
            </div>

        )
    }
}

export default connect(
    state => ({
        value: state.ui.messagesInputs[state.ui.selectedChat] || '',
        isMember: state.db.chats[state.ui.selectedChat].isMember,
        attachments: state.ui.attachments[state.ui.selectedChat] || []
    }),
    dispatch => ({
        send: (message, attachments) => dispatch(sendClick(message, attachments)),
        inputChange: value => dispatch(messageInputChange(value)),
        attach: images => dispatch(attachImages(images)),
        removeAttachments: () => dispatch(deleteAttachments())
    })
)(MessageInput)