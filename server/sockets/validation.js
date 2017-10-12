const log = require('../log')('validator')
const {length} = require('../cfg').limits
const assert = require('assert')
const validator = require('validator')
const {
    TRY_SIGN_IN, TRY_SIGN_UP, FETCH_CHAT, TRY_CREATE_ROOM, TRY_CREATE_1_TO_1,
    TRY_SEND, FETCH_MESSAGES, FETCH_USERS, TRY_SEARCH_USERS, TRY_INVITE_USERS,
    TRY_MARK_READ, FETCH_ONLINE_USERS, START_TYPING, END_TYPING, DELETE_MESSAGES,
    REMOVE_USER, LEAVE_CHAT, EXIT_REQUEST, DELETE_CHAT, UPDATE_CHAT_INFO,
    CHAT_NAME, CHAT_AVATAR, CHAT_DESCRIPTION, UPDATE_USER_INFO, USER_AVATAR,
    USER_DESCRIPTION, USER_PASSWORD
} = require('./actions')

module.exports = action => {
    try {
        const {
            name, surname, password, username, avatar, description, search, message,
            chatId, userId, userIds, messageIds, lastMessageId
        } = action

        switch (action.type) {
            case TRY_SIGN_IN:
                assert(validator.isLength(username, length.username))
                assert(validator.isLength(password, length.password))
                break
            case TRY_SIGN_UP:
                assert(validator.isLength(name, length.name))
                assert(validator.isLength(surname, length.surname))
                assert(validator.isLength(avatar, length.avatar))
                assert(validator.isLength(description, length.description))
                assert(validator.isLength(username, length.username))
                assert(validator.isLength(password, length.password))
                break
            case TRY_CREATE_ROOM:
                assert(validator.isLength(name, length.roomName))
                assert(validator.isLength(avatar, length.avatar))
                assert(validator.isLength(description, length.description))
                assert(Array.isArray(userIds))
                userIds.forEach(userId => {
                    assert(validator.isMongoId(userId))
                })
                break
            case FETCH_CHAT:
            case TRY_MARK_READ:
            case START_TYPING:
            case END_TYPING:
            case LEAVE_CHAT:
            case DELETE_CHAT:
                assert(validator.isMongoId(chatId))
                break
            case EXIT_REQUEST:
                assert(chatId === '' || validator.isMongoId(chatId))
                break
            case TRY_CREATE_1_TO_1:
                if(userId)
                    assert(validator.isMongoId(userId))
                break
            case UPDATE_CHAT_INFO:
                assert(validator.isMongoId(chatId))
                switch (action.field) {
                    case CHAT_NAME:
                        assert(validator.isLength(action.value, length.roomName))
                        break
                    case CHAT_AVATAR:
                        assert(validator.isLength(action.value, length.avatar))
                        break
                    case CHAT_DESCRIPTION:
                        assert(validator.isLength(action.value, length.description))
                        break
                    default:
                        assert(false)// :D
                }
                break
            case UPDATE_USER_INFO:
                switch (action.field) {
                    case USER_AVATAR:
                        assert(validator.isLength(action.value, length.avatar))
                        break
                    case USER_DESCRIPTION:
                        assert(validator.isLength(action.value, length.description))
                        break
                    case USER_PASSWORD:
                        assert(validator.isLength(action.value, length.password))
                        assert(validator.isLength(action.oldPassword, length.password))
                        break
                    default:
                        assert(false)// :D
                }
                break
            case REMOVE_USER:
                assert(validator.isMongoId(chatId))
                assert(validator.isMongoId(userId))
                break
            case FETCH_MESSAGES:
                assert(validator.isMongoId(chatId))
                assert(validator.isMongoId(lastMessageId))
                break
            case TRY_SEND:
                assert(validator.isMongoId(chatId))
                assert(validator.isLength(message, length.message))
                break
            case TRY_INVITE_USERS:
                assert(validator.isMongoId(chatId))
                assert(Array.isArray(userIds))
                userIds.forEach(userId => {
                    assert(validator.isMongoId(userId))
                })
                break
            case FETCH_USERS:
            case FETCH_ONLINE_USERS:
                assert(Array.isArray(userIds))
                userIds.forEach(userId => {
                    assert(validator.isMongoId(userId))
                })
                break
            case DELETE_MESSAGES:
                assert(Array.isArray(messageIds))
                messageIds.forEach(messageId => {
                    assert(validator.isMongoId(messageId))
                })
                break
            case TRY_SEARCH_USERS:
                assert(validator.isLength(search, length.search))
                break
        }
    }
    catch (e) {
        log.debug(action)
        log.debug(e)
        return false
    }
    return true
}