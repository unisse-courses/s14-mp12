// incomplete, not yet working

const express = require('express');
const router = express.Router();
const postFullModel = require('../models/postFullModel');

router.post('/create', (req,res) => {
    const post = new postFullModel({
        pfTitle: req.body.pfTitle,
        pfUsername: req.body.pfUsername,
        // incomplete
    });

    post.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});



//getting the Post With ID
router.get('/post', function(req, res){
    var postId = req.body._id;

    postFullModel.findById(postId, function(err, result){
        if (err) throw err;
        res.send(result);
    });
});



module.exports = router;