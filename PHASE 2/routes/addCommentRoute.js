const express = require('express');
const router = express.Router();
const commentsModel = require('../models/commentsModel');

router.post('/', (req,res) => {
    const Comments = new commentsModel({
        cUsername: req.body.cUsername,
        content: req.body.content,
    });

    Comments.save()
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        res.json({message: err});
    });
});

module.exports = router;