const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb';

const options = { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false };

mongoose.connect(dbURL, options);

const RatingSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    numRating: {
        type: Number,
        required: true
    },
    postId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('rating', RatingSchema);