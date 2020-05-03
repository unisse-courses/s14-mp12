const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb';

const options = { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false };

mongoose.connect(dbURL, options);

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