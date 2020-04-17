const mongoose = require('mongoose');
const multer = require('multer');
const gridfs = require('multer-gridfs-storage');

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
    pfUsername: {
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
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'ingredients'}],
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
    pfNumComments: Number,
    pfURL: {
        type: String,
        required: true 
    },
    pfCommentList: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}]  
});

module.exports = mongoose.model('post_full', PostFullSchema);