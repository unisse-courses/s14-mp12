// can create, no read yet

const express = require('express');
const router = express.Router();
const postModel = require('../models/postFullModel')


//Create
router.post('/viewPost/:postId/makeRating', (req,res) => {
    if(!req.session.user) {
        console.log("User is not logged in.")

        res.redirect('/login' + '?message=Rating is for logged in users. Please login first.');
    }

    else {
        postModel.findById(req.params.postId).exec((err, postResult) => {

            var post = postResult.toObject();

            var ratedUsers = post.pfRatings
            var rated = false;

            // If username where found in the ratings
            ratedUsers.forEach((doc) => {
                console.log(doc)
                if(doc.ratingUser == req.session.user.username)
                    rated = true;
            })
            
            console.log(rated);

            // If Found
            if(rated == true){
                console.log("User had rated this post")
                
                res.redirect(post.pfURL + "?message=You have rated this post already!");
            }
            
            // Push the Data
            else {
                var rate = parseInt(req.body.pfRating);
                var rating = {
                    rating: rate,
                    ratingUser: req.session.user.username
                }
                
                postResult.pfRatings.push(rating);
                postResult.save();

                var url = '/viewPost/' + req.params.postId;
                res.redirect(url)
            }
        })
    }
});

module.exports = router;