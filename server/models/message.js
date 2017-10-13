const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const messageSchema = mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Message', messageSchema)