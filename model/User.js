const mongoose = require('mongoose');
const { use } = require('../router/auth');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('User', userSchema);