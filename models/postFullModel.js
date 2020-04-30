const mongoose = require('mongoose');

const dbURL = 'mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb';

const options = { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false };

mongoose.connect(dbURL, options);

const PostFullSchema = mongoose.Schema({
    pfTitle: {
        type: String,
        required: true
    },
    pfUserId: {
        type: String,
        required: true
    },
    pfDate: {
        type: Date,
        defualt: Date.now
    },
    pfStarRating: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'rating'}],
        required: true
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
    pfCommentList: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}]  
});

module.exports = mongoose.model('post_full', PostFullSchema);