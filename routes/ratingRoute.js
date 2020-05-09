// can create, no read yet

const express = require('express');
const router = express.Router();
const postModel = require('../models/postFullModel')


//Create
router.post('/viewPost/:postId/makeRating', (req,res) => {
    if(!req.user)
        res.redirect('/login');

    postModel.findById(req.params.postId)
    .exec((err, post) => {

        post = post.toObject();

        var ratedUsers = post.pfRatings
        console.log(ratedUsers);
        var rated = false;

        // If username where found in the ratings
        ratedUsers.forEach((doc) => {
            if(doc.ratingUser == req.session.user.username)
                rated = true;
        })
        
        // If Found
        if(rated == true)
            alert("You have rated this post!")
        
        // Push the Data
        else {
            var rating = {
                rating: req.body.rating,
                ratingUser: req.session.user.username
            }

            post.pfRatings.push(rating);
            post.save();

            var url = '/viewPost/' + req.params.postId;
            res.redirect(url)
        }
    })
});

module.exports = router;