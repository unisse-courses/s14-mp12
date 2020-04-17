const express = require('express');
const router = express.Router();
const UserAccount = require('../models/userAccountModel');

router.get('/', function (req, res) {
    res.render('register')
});

router.post('/', async (req,res) => {
    const userAcct = new UserAccount({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        // profPic: req.body.profPic,
        bioDescription: req.body.bioDescription,
    });

    try{
        const newUser = await userAcct.save();
        res.json();
    }catch(err) {
        res.json({message: err});
    }
});



module.exports = router;