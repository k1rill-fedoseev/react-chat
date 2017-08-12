const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

const userMessageSchema = mongoose.Schema({
    message: {
        type: ObjectId,
        ref: 'message'
    },
    room: {
        type: ObjectId,
        ref: 'room'
    },
    date: Date,
    owner: {
        type: ObjectId,
        ref: 'user',
        required: true
    }
});

userMessageSchema.index({owner: 1, room: 1, date: -1});

module.exports = mongoose.model('userMessage', userMessageSchema);