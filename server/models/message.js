const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId

const messageSchema = mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'user'
    },
    message: {
        type: String,
        required: true,
        maxlength: 1024
    },
    read: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('message', messageSchema)