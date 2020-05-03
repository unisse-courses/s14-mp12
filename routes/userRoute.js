
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
const viewUser = require('../config/renderUser');
const passport = require('passport');
const initDb = require("../config/db").initDb;
const getDb = require("../config/db").getDb;

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
                      res.redirect('/login');
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
  res.render('login',{layout: 'loggedOut'})
});

// Login User
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
  successRedirect: '/viewProfile',
  failureRedirect: '/',
  })(req, res, next);
});

//View User
router.get('/viewProfile', viewUser.renderUser);

//View Other Users
router.get('/viewUser/:userId', (req, res, next) => {
  var userId = req.params.userId;
  UserAccount.findById(userId)
    //.populate('','')
    .exec(function (err, result) {
      if (err) {
        res.send(err)
      } else if (!result) {
        // User not Found
        res.redirect('/login');
      } else {
        var user = JSON.parse(JSON.stringify(result));
        //Goes to user profile
        var bool = false;
        if (req.user) {
            if (req.session.passport.user == userId)
                bool = true;       
        }
        var date = result.dateJoined;
        var year = date.getFullYear();
        var day = date.getDate();
        var month = date.getMonth();
        var monthWord = new Array();
        monthWord[0] = "January";
        monthWord[1] = "February";
        monthWord[2] = "March";
        monthWord[3] = "April";
        monthWord[4] = "May";
        monthWord[5] = "June";
        monthWord[6] = "July";
        monthWord[7] = "August";
        monthWord[8] = "September";
        monthWord[9] = "October";
        monthWord[10] = "November";
        monthWord[11] = "December";

        date = monthWord[month] + ' ' + day + ', ' + year
        var params = {
          layout: 'main',
          isUser: bool,
          user: user,
          date: date,
          profPic: finalFile
        }
        res.render('userAccount', params);
      }
    });
});


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