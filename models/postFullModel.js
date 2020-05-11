const mongoose = require('mongoose');

const PostFullSchema = mongoose.Schema({
    pfTitle: {
        type: String,
        required: true
    },
    pfUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_accounts',
        required: true
    },
    pfDescription: {
        type: String,
        required: true
    },
    pfDate: {
        type: Date,
        defualt: Date.now
    },
    pfRatings: {
        type: [{
            rating: Number,
            ratingUser: String
        }]
    },
     pfImages: {
        type: [String],
        required: true
    }, 
    pfIngredients: {
        type: [{
            quantity: String,
            unit: String, 
            name: String
        }],
        required: true
    },
    pfDirections: {
        type: [String],
        required: true
    },
    pfTags: {
        type: [String],
        required: true
    },
    pfURL: {
        type: String
    },
    pfCommentList: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}],
    pfNumberRating: {
        type: Number
    }
});

module.exports = mongoose.model('post_full', PostFullSchema);