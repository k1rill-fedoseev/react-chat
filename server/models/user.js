const mongoose = require('mongoose'),
    crypto = require('crypto'),
    log = require('../log')('userModel'),
    config = require('../cfg'),
    ObjectId = mongoose.Schema.Types.ObjectId

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
        default: ''
    },
    username: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    hashedPassword: String,
    salt: String,
    hashedToken: {
        type: String,
        index: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: 'http://kiratty.com/uploads/posts/2015-01/1420306955_39.latte-art.jpg'
    },
    lastOnline: {
        type: Date,
        default: Date.now()
    }
})

userSchema.index({username: 'text', name: 'text', surname: 'text'})

userSchema.virtual('password').set(
    function (password) {
        this.genSalt(20)
        this._password = password
        this.hashedPassword = this.encrypt(password)
    }).get(() => this._password)

userSchema.virtual('token').get(() => this._token)

userSchema.methods = {
    genSalt: function (length) {
        return this.salt = crypto.randomBytes(length).toString('hex')
    },
    encrypt: function (data, salt) {
        return crypto.createHmac('sha512', salt || this.salt)
            .update(data)
            .digest('hex')
    },
    genToken: function()  {
        this._token = crypto.randomBytes(config.token.size).toString('hex')
        this.hashedToken = this.encrypt(this._token, config.token.key)

        log.trace('Generated new token ' + this._token + ' for user ' + this.username)

        return this._token
    }
}

userSchema.statics = {
    encrypt: (data, salt) => crypto.createHmac('sha512', salt)
        .update(data)
        .digest('hex')
}

module.exports = mongoose.model('user', userSchema)