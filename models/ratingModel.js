const mongoose = require('mongoose');

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