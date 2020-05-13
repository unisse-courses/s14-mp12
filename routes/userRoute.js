
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
const controller = require('../setters/controller');
const passport = require('passport');
const initDb = require("../setters/db").initDb;
const getDb = require("../setters/db").getDb;

let gfs;
var db = getDb();

db.once('open', () => {
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

const upload = multer({ storage: storage });


// Render register page
router.get('/register', function (req, res) {
  res.render('register', {layout: 'loggedOut'})
});

// Register User
router.post('/register', upload.single('profPic'), (req, res) => {
  // Finding Same User Name
  UserAccount.findOne({ username: req.body.username })
    .then(result => {
      // If There's existing user
      if (result != null) {
        console.log("User exists!");
        res.redirect('register');
      } else {
        UserAccount.findOne({ email: req.body.email })
          .then(result => {
            if (result != null) {
              console.log("Email exists!");
              res.redirect('register');
            } else {
              // Create User
              const userAcct = new UserAccount({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profPic: req.file.filename,
                description: req.body.description,
                dateJoined: new Date()
              });

              console.log(req.file.filename);

              bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(userAcct.password, salt, (err, hash) => {
                  if (err) throw err;

                  userAcct.password = hash;
                  userAcct.save()
                    .then(acct => {
                      console.log(userAcct);
                      res.redirect('/login?message=Register successfully!');
                    })
                    .catch(err => console.log(err));
                }));
            }
          });
      }
    });
});

// Render login page
router.get('/login', function (req, res) {
  var params = {
    layout: 'loggedOut',
    message: req.query.message
  }
  res.render('login', params)
});

// Login User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
  successRedirect: '/setProfile',
  failureRedirect: '/retryLogin',
  })(req, res, next);
});

// Invalid Login
router.get('/retrylogin', function (req, res) {
  var params = {
    layout: 'loggedOut',
    message: req.query.message
  }
  res.render('retryLogin', params)
});

//View User
router.get('/setProfile', controller.renderUser);

router.get('/viewProfile/new', controller.getUser);
router.get('/viewProfile/popular', controller.getUser);
router.get('/viewProfile/popular/5star', controller.getUser);
router.get('/viewProfile/popular/4star', controller.getUser);
router.get('/viewProfile/popular/3star', controller.getUser);
router.get('/viewProfile/popular/2star', controller.getUser);
router.get('/viewProfile/popular/1star', controller.getUser);

//View Other Users
router.get('/viewUser/:username/new', controller.getOtherUser);

router.get('/viewUser/:username/popular', controller.getOtherUser);
router.get('/viewUser/:username/popular/5star', controller.getOtherUser);
router.get('/viewUser/:username/popular/4star', controller.getOtherUser);
router.get('/viewUser/:username/popular/3star', controller.getOtherUser);
router.get('/viewUser/:username/popular/2star', controller.getOtherUser);
router.get('/viewUser/:username/popular/1star', controller.getOtherUser);



// LogOut
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.render('login',{layout: 'loggedOut'});
      }
    });
  }
});

module.exports = router;