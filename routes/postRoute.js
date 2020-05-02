// incomplete, not yet working

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const crypto = require("crypto");
const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
const bcrypt = require('bcryptjs');
const path = require('path');

// Models
const postFullModel = require('../models/postFullModel');
const ratingModel = require('../models/ratingModel')
const commentModel = require('../models/commentsModel')

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

router.get('/createPost', viewUser.getProfPic);

router.post('/createPost', upload.array('pfImages',5), (req,res) => {
  
  var filenames = req.files.map(function(file) {
    return file.filename;
  })

  let ratings = new ratingModel();
  let comments = new commentModel();


  const post = new postFullModel({
      pfTitle: req.body.pfTitle,
      pfUserId: req.session.passport.user,    // User id
      pfDescription: req.body.pfDescription,
      pfImages: filenames,
      pfIngredients: req.body.pfIngredients,
      pfDirections: req.body.pfDirections,
      pfTags: req.body.pfTags,
      pfDate: new Date(),
      pfRatings: ratings,
      pfComments: comments,
      pfURL: ''
  });

  console.log(post);
    
  post.save()
  .then(result => {

    var URL = '/viewPost/' + result._id;

    result.updateOne({pfURL: URL})

    .then(reason => {
      res.redirect(URL)
    })

  })
  .catch(err => {
      res.status(404).json(err);
  });
});

//getting the Post With ID
// router.get('/viewPost/:postId', function(req, res){
//     var postId = req.params._id;

//     postFullModel.findById(postId)
//         .populate('rating')
//         .populate('comments')
//         .exec(function(err, post) {
//             if(err) {
//                 console.log(err);
//             } 
//             else {
//                 console.log(post);
//                 res.render('postFull'); //viewUser.getPostFull
//              }    
//         });
// });

router.get('/viewPost/:postId',viewUser.getPostFull);




module.exports = router;