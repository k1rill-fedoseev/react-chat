const log = require('../log')('validator')
const assert = require('assert')
const validator = require('validator')
const {
    TRY_SIGN_IN, TRY_SIGN_UP, FETCH_CHAT, TRY_CREATE_ROOM, TRY_CREATE_1_TO_1,
    TRY_SEND, FETCH_MESSAGES, FETCH_USERS, TRY_SEARCH_USERS, TRY_INVITE_USERS,
    TRY_MARK_READ, FETCH_ONLINE_USERS, START_TYPING, END_TYPING, DELETE_MESSAGES,
    REMOVE_USER, LEAVE_CHAT, EXIT_REQUEST
} = require('./actions.js')

module.exports = (action) => {
    try {
        const {
            name, surname, password, username, avatar, desc,
            chatId, userId, userIds, messageIds, lastMessageId
        } = action

        switch (action.type) {
            case TRY_SIGN_IN:
                assert(validator.isLength(username, {min: 1, max: 20}))
                assert(validator.isLength(password, {min: 3, max: 128}))
                break
            case TRY_SIGN_UP:
                assert(validator.isLength(name, {min: 2, max: 16}))
                assert(validator.isLength(surname, {min: 2, max: 16}))
                assert(validator.isLength(avatar, {max: 256}))
                assert(validator.isLength(desc, {max: 256}))
                assert(validator.isLength(username, {min: 1, max: 20}))
                assert(validator.isLength(password, {min: 3, max: 128}))
                break
            case TRY_CREATE_ROOM:
                assert(validator.isLength(name, {min: 1, max: 30}))
                assert(validator.isLength(avatar, {max: 256}))
                assert(validator.isLength(desc, {max: 256}))
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
            case EXIT_REQUEST:
                assert(validator.isMongoId(chatId))
                break
            case TRY_CREATE_1_TO_1:
                assert(validator.isMongoId(userId))
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
                assert(validator.isLength(message, {min: 1, max: 256}))
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
                assert(validator.isLength(search, {min: 1, max: 30}))
                break
        }
    }
    catch(e) {
        log.debug(e)
        return false
    }
    return true
}