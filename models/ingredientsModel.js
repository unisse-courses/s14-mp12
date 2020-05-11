const mongoose = require('mongoose');

const IngredientsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    postId: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('ingredients', IngredientsSchema);