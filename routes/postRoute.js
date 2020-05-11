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
const userModel = require('../models/userAccountModel')

const controller = require('../setters/controller');


const initDb = require("../setters/db").initDb;
const getDb = require("../setters/db").getDb;

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

router.get('/createPost', controller.getUser);

router.post('/createPost', upload.array('pfImages',5), (req,res) => {
  
  var filenames = req.files.map(function(file) {
    return file.filename;
  })

  console.log(req.session.user)

  const post = new postFullModel({
      pfTitle: req.body.pfTitle,
      pfUser: req.session.user,    // User id
      pfDescription: req.body.pfDescription,
      pfImages: filenames,
      pfIngredients: req.body.pfIngredients,
      pfDirections: req.body.pfDirections,
      pfTags: req.body.pfTags,
      pfDate: new Date(),
      pfComments: new commentModel(),
      pfURL: '',
      pfNumberRating: 0
  });

  console.log(post);
    
  post.save()
  .then(resultPost => {

    var URL = '/viewPost/' + resultPost._id;
    var userId = resultPost.pfUser._id;

    resultPost.updateOne({pfURL: URL})
    .then(reason => {

      userModel.findById(userId, (err, userObj) =>{
          userObj.recipePost.push(resultPost)
          userObj.save();
          
          console.log(resultPost);

          req.session.userPostsId = userObj.recipePost;
                        
          res.redirect(URL)
        });
    })

  })
  .catch(err => {
      res.status(404).json(err);
  });
});

router.get('/viewPost/:postId',controller.getPostFull);



module.exports = router;