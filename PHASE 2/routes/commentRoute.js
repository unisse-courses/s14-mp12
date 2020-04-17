// can create and update, no read and delete yet

const express = require('express');
const router = express.Router();
const commentsModel = require('../models/commentsModel');

//Read
router.get('/', (req,res) => {
    commentsModel.find({}, function(err, comments) {
        if (err) throw err;
        console.log(comments);
        res.send(comments);
    });
});

//Create
router.post('/add', (req,res) => {
    const comment = new commentsModel({
        cUsername: req.body.cUsername,
        content: req.body.content,
    });

    comment.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

//Update
router.put('/edit/:commentId', (req,res) => {
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
router.delete('/delete/:commentId', (req,res) => {
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