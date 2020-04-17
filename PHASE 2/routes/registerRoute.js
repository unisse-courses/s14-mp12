// fix, not yet working

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const UserAccount = require('../models/userAccountModel');
const crypto = require("crypto");
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
const bcrypt = require('bcryptjs');
const path = require('path');

const client = mongoose.connect('mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb',    
{ useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    if(mongoose.connection.readyState == 1);
    {   
        console.log("Connected to DB! " +  mongoose.connection.readyState);
    }
});

let gfs; 
var db = mongoose.connection;

db.once('open', ()=>{
    //Init Stream
    gfs = Grid(db, mongoose.mongo);
    gfs.collection('uploads');
})

//create storage engine for user and event reg
const storage = new GridFsStorage({
    db: client,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
          //crypto to generate random names
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          //create filename
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

const upload = multer({storage: storage});


router.get('/', function (req, res) {
    res.render('register')
});

router.post('/', upload.single('profPic'), (req,res) => {
    UserAccount.findOne({email: req.body.email})
    .then(user => {
        if(user){
            console.log("user exists");
        }
        else{
            const userAcct = new UserAccount({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profPic: req.file.filename,
                description: req.body.description
            });

            console.log(userAcct.username);

            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(userAcct.password, salt, (err, hash) => {
                    if(err) throw err;

                    userAcct.password = hash;
                    userAcct.save()
                    .then(acct => {
                        res.redirect('/login');
                    })
                    .catch(err => console.log(err));
                }));
        }
    })
});

module.exports = router;