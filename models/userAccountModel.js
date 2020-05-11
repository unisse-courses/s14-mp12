const mongoose = require('mongoose');

const UserAccountSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profPic: {
        type: String
    },   
    description: {
        type: String
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    recipePost: [{type: mongoose.Schema.Types.ObjectId, ref: 'post_full'}]
});

module.exports = mongoose.model('user_account', UserAccountSchema);