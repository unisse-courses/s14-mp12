const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

mongoose.connect(dbURL, options);

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