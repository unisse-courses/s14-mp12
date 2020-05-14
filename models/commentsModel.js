const mongoose = require('mongoose');

const CommentsSchema = mongoose.Schema({
        cUsername: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        cDatePosted: {          // cTimePosted is here also
            type: Date,
            defualt: Date.now
        }
    }
);

module.exports = mongoose.model('comments', CommentsSchema);