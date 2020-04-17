const express = require('express');
const router = express.Router();
const ratingModel = require('../models/ratingModel');

router.post('/', (req,res) => {
    const Rating = new ratingModel({
       // postID: req.params.
        username: req.body.username,
        numRating: req.body.numRating,
    });

    Rating.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

module.exports = router;