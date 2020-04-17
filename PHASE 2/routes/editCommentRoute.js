const express = require('express');
const router = express.Router();
const commentsModel = require('../models/commentsModel');

// router.route('/:commentId')
//     .patch((req,res) => {
//         commentsModel.findById(req.params.commentId, (err, comments) => {
//             comments.content = req.body.content;
//             comments.save();
//             res.json(comments);
//         })
//     })

router.put('/:commentId', (req,res) => {
    const query = {
        _id: req.params.commentId
    }

    const update = {
        content: req.body.content
    };

    commentsModel.updateOne(query, update, {new: true}, function(err, addComment) {
        if (err) throw err;
        console.log(addComment);
        res.send(addComment);
    });
});

module.exports = router;