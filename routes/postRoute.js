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

const client = mongoose.connect('mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb',    
{ useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    if(mongoose.connection.readyState == 1);
    {   
        console.log("Connected to DB! " +  mongoose.connection.readyState);
    }
});

// let gfs; 
// var db = mongoose.connection;

// db.once('open', ()=>{
//     //Init Stream
//     gfs = Grid(db, mongoose.mongo);
//     gfs.collection('uploads');
// })

// //create storage engine for user and event reg
// const storage = new GridFsStorage({
//     db: client,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//           //crypto to generate random names
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           //create filename
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });

// const upload = multer({storage: storage});

router.get('/createPost', function (req, res) {
    res.render('createPost')
});

// router.post('/createPost', (req,res) => {
//     const post = new postFullModel({
//         pfTitle: req.body.pfTitle,
//         pfUsername: req.body.pfUsername,
//         // incomplete
//     });

//     post.save()
//     .then(data => {
//         res.json(data);
//     })
//     .catch(err => {
//         res.json({message: err});
//     });
// });

// router.post('/createPost', upload.array('pfImages'), (req,res) => {
//     postFullModel.findOne('post_full.pfTitle')
//     .then(post => {
//         if(post){
//             console.log("post title exists");
//         }
//         else{
//             const post = new postFullModel({
//                 pfTitle: req.body.pfTitle,
//                 pfImages: req.body.email,
//                 pfIngredients: req.body.password,
//                 pfDirections: req.file.filename,
//                 pfTags: req.body.description
//             });

//             console.log(post.pfTitle);

//             bcrypt.genSalt(10, (err, salt) => 
//                 bcrypt.hash(userAcct.password, salt, (err, hash) => {
//                     if(err) throw err;

//                     userAcct.password = hash;
//                     userAcct.save()
//                     .then(acct => {
//                         res.redirect('/login');
//                     })
//                     .catch(err => console.log(err));
//                 }));
//         }
//     })
// });



//getting the Post With ID
router.get('/viewPost/:postId', function(req, res){
    var postId = req.params._id;

    postFullModel.findById(postId)
        .populate('rating')
        .populate('ingrdients')
        .populate('comments')
        .exec(function(err, post) {
            res.send(post);
            console.log(post);
          });
});



module.exports = router;