// incomplete, not yet working

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const postFullModel = require('../models/postFullModel');
const crypto = require("crypto");
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
const bcrypt = require('bcryptjs');
const path = require('path');

const viewUser = require('../config/renderUser');


const initDb = require("../config/db").initDb;
const getDb = require("../config/db").getDb;

let gfs;
var db = getDb();

db.once('open', ()=>{
    //Init Stream
    gfs = Grid(db, mongoose.mongo);
    gfs.collection('uploads');
})

//create storage engine for user and event reg
const storage = new GridFsStorage({
    db: db,
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

router.get('/createPost', viewUser.viewCreatePost);

router.post('/createPost', upload.array('pfImages'), (req,res) => {
    postFullModel.findOne('post_full.pfTitle')
    .then(post => {
        if(post){
            console.log("post title exists");
        }
        else{
            const post = new postFullModel({
                pfTitle: req.body.pfTitle,
                pfImages: req.file.filename,
                pfIngredients: req.body.pfIngredients,
                pfDirections: req.body.pfDirections,
                pfTags: req.body.pfTags
            });

            console.log(post.pfTitle);
            
            post.save()
            .then(post => {
                res.redirect('/homepage');
            })
            .catch(err => {
                res.json({message: err});
            });
        }
    })
});

//getting the Post With ID
router.get('/viewPost/:postId', function(req, res){
    var postId = req.params._id;

    postFullModel.findById(postId)
        .populate('rating')
        .populate('ingrdients')
        .populate('comments')
        .exec(function(err, post) {
            if(err) {
                console.log(err);
            } 
            else {
                res.send(post);
                console.log(post);
                //res.render('postFull');
            }    
        });
});



module.exports = router;