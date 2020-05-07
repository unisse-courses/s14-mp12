// can create and update, no read and delete yet

const express = require('express');
const router = express.Router();
const commentsModel = require('../models/commentsModel');
const postModel = require('../models/postFullModel')

//Read
router.get('/comments', (req,res) => {
    commentsModel.find({}, function(err, comments) {
        if (err) throw err;
        console.log(comments);
        res.send(comments);
    });
});

//Create
router.post('/viewPost/:postId/addComment', (req,res) => {

    if(!req.user)
        res.redirect('/login');

    const comment = new commentsModel({
        cUsername: req.session.user.username,
        cDatePosted: new Date(),
        content: req.body.comment
    });

    console.log(comment);

    comment.save()
    .then(data => {
        postModel.findById(req.params.postId, (err, post) =>{
            post.pfCommentList.push(comment);
            post.save();
            // res.redirect(req.baseUrl);

            var url = '/viewPost/' + req.params.postId;
            res.redirect(url);
        })
    })
    .catch(err => {
        res.json({message: err});
    });
});

//Update
router.put('/editComment/:commentId', (req,res) => {
    const query = {
        _id: req.params.commentId
    }

    const update = {
        content: req.body.content
    };

    commentsModel.updateOne(query, update, {new: true}, function(err, comments) {
        if (err) throw err;
        console.log(comments);
        res.send(comments);
    });
});

//Delete
router.delete('/deleteComment/:commentId', (req,res) => {
    const query = {
        _id: req.params.commentId
    }

    commentsModel.remove(query, function(err, comments) {
        if (err) throw err;
        console.log(comments);
        res.send(comments);
    });
});

// router.route('/:commentId')
//     .patch((req,res) => {
//         commentsModel.findById(req.params.commentId, (err, comments) => {
//             comments.content = req.body.content;
//             comments.save();
//             res.json(comments);
//         })
//     })

module.exports = router;