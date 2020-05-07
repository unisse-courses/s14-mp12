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
        post.pfRatings.push(req.body.rating);
        post.save();

        var url = '/viewPost/' + req.params.postId;
        res.redirect(url)
    })
});

module.exports = router;