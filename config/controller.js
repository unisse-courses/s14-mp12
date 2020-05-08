const getDb = require('./db').getDb;
const UserAccount = require('../models/userAccountModel');
const postFullModel = require('../models/postFullModel');
const commentModel = require('../models/commentsModel');

// Variables
const db = getDb();

const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');

function getDate(date, kind) {
    
    var year = date.getFullYear();
    var day = date.getDate();
    var month = date.getMonth();
    var monthWord = new Array();

    if(kind == 1){
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
    } else if (kind == 2) {
        for(let i = 0; i < 12;i++) {
            if(i < 9)
                monthWord[i] = '0' + (i+1);
            else
                monthWord[i] = (i+1);
        }
        year = year % 100;
        date = monthWord[month] + '/' + day + '/' + year;
    }

    return date;
}

function getTime(time){
    var hour = time.getHours()
    var minute = time.getMinutes();

    if(minute < 10)
        minute = '0' + minute;

    return hour + ':' + minute;
}

module.exports.renderUser = (req, res) => {
    
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        const fileName = res.locals.photo;
        var userId = req.session.passport.user;
        console.log(req.session)
        UserAccount.findById(userId)
            //.populate('', '')
            .exec(function (err, result) {
                if (err) {
                    res.send(err);
                } else {

                    collection.find({ filename: fileName }).toArray(function (err, docs) {
                        console.log(docs._id + " id");
                        if (err) {
                            return res.send(err);
                        }
                        if (!docs || docs.length === 0) {
                            return res.send(err);
                        } else {
                            //Retrieving the chunks from the db

                            collectionChunks.find({ files_id: docs[0]._id }).sort({ n: 1 }).toArray(function (err, chunks) {
                                if (err) {
                                    return res.send(err);
                                }
                                if (!chunks || chunks.length === 0) {
                                    //No data found
                                    return res.send(err);
                                }
                                //Append Chunks
                                let fileData = [];
                                for (let i = 0; i < chunks.length; i++) {

                                    //This is in Binary JSON or BSON format, which is stored
                                    //in fileData array in base64 endocoded string format
                                    fileData.push(chunks[i].data.toString('base64'));
                                }
                                //Display the chunks using the data URI format
                                let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                                
                                var date = getDate(result.dateJoined, 1);
                                
                                req.session.profPic = finalFile;   
                                req.session.user = result;
                                req.session.userPostsId = result.recipePost
                                req.session.dateJoined = date;
                                
                                res.redirect('/viewProfile')
                            });
                        }
                    });
                }
            });
    }
}

module.exports.getOtherUser = (req, res) => {

    var params = {}
    var username = req.params.username;

    if(!req.isAuthenticated())
        params.layout = 'main';
    else {
        params.navProfPic = req.session.profPic;
        params.layout = 'loggedIn';
    }


    UserAccount.findOne({username: username}, (err, user) => {
        if(user) {

            console.log(user);
            // Save to params for Layout
            params.dateJoined = getDate(user.dateJoined, 1)
            params.user = user.toObject();

            // Variables for ProfPic
            var userId = user._id;
            var filename = user.profPic

            collection.find({ filename: filename }).toArray(function (err, docs) {

                //Retrieving the chunks from the db
                collectionChunks.find({ files_id: docs[0]._id }).sort({ n: 1 }).toArray(function (err, chunks) {
                    
                    //Append Chunks
                    let fileData = [];
                    for (let i = 0; i < chunks.length; i++) {

                        //This is in Binary JSON or BSON format, which is stored
                        //in fileData array in base64 endocoded string format
                        fileData.push(chunks[i].data.toString('base64'));
                    }

                    //Saving To Final File (Converted)
                    let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                    params.profPic = finalFile;

                    postFullModel.find({pfUserId: userId}).sort({_id: -1}).limit(15).then(userPosts => {
                        var userPostsObj = [];

                        if(userPosts.length) {
                            // Object all the posts
                            userPosts.forEach(function(doc) {
                                var post = doc.toObject()
                                var date = post.pfDate
                                post.pfDate = getDate(date, 1);
                                userPostsObj.push(post);
                            })

                            params.userPosts = userPostsObj
                        }
        
                        res.render('userAccount', params);
                    });
                });
            });

        } else {
            alert("No user found");
            res.render('homepage',params);
        }
    });
}


module.exports.getUser = (req, res) => {

    //Others
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        var params = {
            layout: 'loggedIn',
            navProfPic: req.session.profPic,
        }

        if(req.path == '/createPost')
            res.render('createPost',params);

        else if(req.path == '/')
            res.render('homepage', params);

        else if(req.path == '/viewProfile') {
            params.user = req.session.user;
            params.dateJoined = req.session.dateJoined;
            params.profPic = req.session.profPic;
            var userPostIds = req.session.userPostsId;

            // Find the Post from array of posts in user account
            postFullModel.find({_id: {$in: userPostIds}}).sort({_id: -1}).limit(15).then(userPosts => {
                var userPostsObj = [];

                if(userPosts.length) {
                    // Object all the posts
                    userPosts.forEach(function(doc) {
                        var post = doc.toObject()
                        var date = post.pfDate
                        post.pfDate = getDate(date, 1);
                        userPostsObj.push(post);
                    })

                    params.userPosts = userPostsObj
                }
            
                res.render('userAccount', params);
            });
        }
    }   
}


module.exports.homepage = (req, res) => {
    // New 
    // req.locals.numPost = 0;

    if(req.path == '/new') {

        var params = {};

        postFullModel.find({}).sort({_id: -1}).limit(15).then(posts => {

            // Returning the users Id
            var userIds = [];
            posts.forEach(function(doc){userIds.push(doc.pfUserId)})

                UserAccount.find({_id: {$in: userIds}}).then(users => {
                // Working with Post Object
                var usernames = [];
                users.forEach(function(user){usernames.push(user.username)})
                
                let postObj = [];

                posts.forEach(function(doc){
                    var post = doc.toObject()
                    var date = post.pfDate
                    post.pfDate = getDate(date, 1);
                    post.username = usernames;
                    postObj.push(post);
                });
    
                params.posts = postObj;

                // Check if Logged in or not
                if(!req.user){
                    params.layout = 'main';
                }
                else {
                    params.layout = 'loggedIn';
                    params.navProfPic = req.session.profPic;
                }

                res.render('homepage', params);
            
            });
        });
    }

    // Popular 
    else if(req.path == '/popular'){

    }
    
}


module.exports.getPostFull = (req, res) => {
    const postId = req.params.postId;
    
    postFullModel.findById(postId)
    .exec((err, post) =>{
        if(err) throw err
    
        const filenames = post.pfImages;
        // console.log("filenames: " + filenames)
    
        collection.find({ filename: {$in: filenames} }).toArray(function (err, docs) {
            if (err) throw err;
        
            let imageList = docs.map(function(data){return data._id});
        
            collectionChunks.find({ files_id: {$in : imageList} }).toArray(function (err, chunks) {
                if(err) throw err;
        
                // got all the chunks for ALL images... So you need to "group by"
                // Reference: https://medium.com/@edisondevadoss/javascript-group-an-array-of-objects-by-key-afc85c35d07e
                let group = chunks.reduce((total, currentVal) => {
                    total[currentVal.files_id] = [...total[currentVal.files_id] || [], currentVal];
                    return total;
                }, {});
        
                let finalFile = [];
                let entries = Object.entries(group);
                
                // Needed to get ID and values in object with the files_id as the key
                // https://zellwk.com/blog/looping-through-js-objects/
                entries.forEach(([file, content]) => {
        
                    // Reduce helps loop through the array and "join" the content
                    let mergedBase64 = content.reduce((total, current) => {
                        let base64 = current.data.toString('base64');
                        return total + base64;
                }, '');
        
                // get contentType of the image from docs
                    let image = docs.find((element) => {
                        return element._id == file;
                    });
        
                // build the image file
                finalFile.push('data:' + image.contentType + ';base64,' + mergedBase64);
            });

            // Other Things needed for hbs
            let postObj = post.toObject();
            
            //rating
            var ratings = postObj.pfRatings;
            var rating = 0;
            var ratingLayout = new Array(5).fill(false);
            console.log(ratingLayout)
            
            ratings.forEach((doc) => { rating += doc });
            rating = rating / ratings.length

            for(let i=0; i < rating; i++)
                ratingLayout[i] = true;

            console.log(ratingLayout)
            console.log(ratings)
            console.log(rating);

            // Comments
            let commentIds = post.pfCommentList
            commentModel.find({_id: { $in: commentIds}})
            .exec((err,comments) => {
                
                let commentsObj = [];
                //Changing the format of cDateJoined
                comments.forEach((doc) => {
                    var comment = doc.toObject();
                    comment.cDatePosted = getDate(comment.cDatePosted, 2) + ' ' + getTime(comment.cDatePosted)
                    commentsObj.push(comment);
                });
                
                // User Who Post the Post
                var userId = postObj.pfUserId;
                UserAccount.findById(userId, (err, poster) => {

                    // User Who Post
                    poster = poster.toObject();
                
                    // Parameters
                    var params = {
                        pfImages: finalFile,
                        post: postObj,
                        datePosted: getDate(postObj.pfDate, 1),
                        poster: poster,
                        layout: '',
                        navProfPic: req.session.profPic,
                        comments: commentsObj,
                        rating: ratingLayout
                    }
                
                    if(!req.isAuthenticated()){
                        params.layout = 'main';
                    } else {
                        params.layout = 'loggedIn'
                        params.loggedInUsername = req.session.user.username
                    }

                    res.render('postFull', params);
                });
            });
        })
    });
    });
}
    