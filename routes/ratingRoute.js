// can create, no read yet

const express = require('express');
const router = express.Router();
const ratingModel = require('../models/ratingModel');

//Read
router.get('/rating', (req,res) => {
    ratingModel.find({}, function(err, rating) {
        if (err) throw err;
        console.log(rating);
        res.send(rating);
    });
});

//Create
router.post('/makeRating', (req,res) => {
    const rating = new ratingModel({
        username: req.body.username,
        numRating: req.body.numRating,
    });

    rating.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

module.exports = router;