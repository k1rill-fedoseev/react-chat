const mongoose = require('mongoose')
const crypto = require('crypto')
const logPassword = require('../log')('PASSWORD')
const config = require('../cfg')
const {NotFoundError, WrongAuthData} = require('./errors')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: config.default.description
    },
    username: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    hashedPassword: String,
    salt: String,
    hashedTokens: [{
        type: String,
        index: true
    }],
    created: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: config.default.userAvatar
    },
    lastOnline: {
        type: Date,
        default: Date.now()
    }
})

userSchema.index({username: 'text', name: 'text', surname: 'text'})

userSchema.virtual('password')
    .set(function (password) {
        this.genSalt(20)
        this._password = password
        this.hashedPassword = this.encrypt(password)

        if (this.username)
            logPassword.trace(this.username, password)
    })

const genSalt = function (length) {
    this.salt = crypto.randomBytes(length).toString('hex')

    return this
}

const encrypt = function (data, salt) {
    return crypto.createHmac('sha512', salt || this.salt)
        .update(data)
        .digest('hex')
}

const genToken = function () {
    this.token = crypto.randomBytes(config.token.size).toString('hex')
    this.hashedTokens.push(this.encrypt(this.token, config.token.key))
    this.hashedTokens = this.hashedTokens.slice(-config.token.maxCount)

    return this
}

const checkPassword = function (password) {
    if (this.hashedPassword !== this.encrypt(password))
        throw new WrongAuthData('Wrong password')

    return this
}

const removeToken = function (token) {
    const attempt = this.encrypt(token, config.token.key)

    this.hashedTokens = this.hashedTokens.filter(hashedToken => hashedToken !== attempt)

    return this
}

const removeAllTokens = function () {
    this.hashedTokens = []

    return this
}

const changePassword = function (oldPassword, newPassword) {
    if (this.encrypt(oldPassword) !== this.hashedPassword)
        throw new WrongAuthData('Wrong old password')

    this.password = newPassword

    return this
}

const updateLastOnline = function () {
    this.lastOnline = Date.now()

    return this
}

const filterUser = function () {
    return {
        username: this.username,
        avatar: this.avatar,
        name: this.name,
        surname: this.surname,
        description: this.description,
        id: this._id.toString()
    }
}

userSchema.methods = {
    genSalt,
    encrypt,
    genToken,
    checkPassword,
    removeToken,
    removeAllTokens,
    changePassword,
    updateLastOnline,
    filter: filterUser
}

const get = function (userId) {
    return this.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`User ${userId} not found`)
            return user
        })
}

const getUsers = function (userIds) {
    const self = this

    return Promise.all(userIds.map(userId => self.get(userId)))
}

const register = function (name, surname, username, password, description) {
    logPassword.trace(username, password)
    return this.create({
        username,
        password,
        name,
        surname,
        description: description || undefined
    })
        .catch(err => {
            throw err.code === 11000
                ? new WrongAuthData(`User ${username} already exists`)
                : err
        })
}

const auth = function (username, password) {
    return this.findOne({username})
        .then(user => {
            if (!user)
                throw new NotFoundError('User not found')

            const attempt = user.encrypt(password)

            if (attempt !== user.hashedPassword)
                throw new WrongAuthData('Wrong password')

            return user
        })
}

const tokenCheck = function (token) {
    const attempt = this.encrypt(token, config.token.key)

    return this.findOne({hashedTokens: attempt})
        .then(user => {
            if (!user)
                throw new WrongAuthData('Wrong token')

            return user
        })
}

const search = function (search, room, userId) {
    const query = room
        ? {
            $nor: [
                {_id: {$in: room.users}},
                {_id: {$in: room.leftUsers}}
            ],
            $text: {$search: search}
        }
        : {
            _id: {$ne: userId},
            $text: {$search: search}
        }

    return this.find(
        query,
        {score: {$meta: 'textScore'}})
        .sort({score: {$meta: 'textScore'}})
        .limit(config.limits.packetSize)
        .then(users => users.map(user => user._id.toString()))
}

const filter = function (users) {
    return users.map(
        user => ({
            username: user.username,
            avatar: user.avatar,
            name: user.name,
            surname: user.surname,
            description: user.description,
            id: user._id.toString()
        })
    )
}

userSchema.statics = {
    encrypt,
    get,
    getUsers,
    auth,
    register,
    tokenCheck,
    search,
    filter
}

module.exports = mongoose.model('User', userSchema)