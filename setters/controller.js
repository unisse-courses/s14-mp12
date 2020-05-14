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

function getRating(ratings) {
    var rating = 0;

    if(ratings.length != 0) {
        ratings.map((doc) => {
            rating += doc.rating
        })
        rating = Math.floor(rating / ratings.length);
    }

    return rating;
}

function getRatingLayout(rating) {
    var ratingLayout = new Array(5).fill(false)
    for(i=0; i<rating; i++)
        ratingLayout[i] = true;
    return ratingLayout
}


module.exports.renderUser = (req, res) => {
    
    if (!req.isAuthenticated()) {
        res.redirect('/login?message=You need to log in first.');
    } else {
        const fileName = res.locals.photo;
        var userId = req.session.passport.user;     
        console.log(req.session);
        UserAccount.findById(userId)
            .exec(function (err, result) {
                if (!result) {
                    console.log("User not yet registered!");
                    res.json(err);
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

                                res.redirect('/viewProfile/new')
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
    var skip = (req.query.page - 1) * 15

    /* Getting the layout and navBarProfPic */
    if(!req.isAuthenticated()) {
        params.viewProfile = false;
        params.layout = 'main';
    } else {
        if(username == req.session.user.username)
            params.viewProfile = true;

        params.navProfPic = req.session.profPic;
        params.layout = 'loggedIn';
    }

    console.log(params.viewProfile);
    /* Checking Path */
    if(req.path.includes('new')) {
        params.new = true;

        UserAccount.findOne({username: username}).populate('recipePost').exec((err, user) => {
            if(user) {

                // Save to params for Layout
                params.dateJoined = getDate(user.dateJoined, 1)
                params.user = user.toObject();

                // Variables for ProfPic
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

                        var posts = params.user.recipePost;
                        let postsObj = []

                        if(posts.length) {
                            // Object all the posts
                            posts.forEach(function(doc) {
                                var post = doc;
                                var date = post.pfDate
                                var rating = getRating(post.pfRatings)

                                post.pfDate = getDate(date, 1);
                                post.ratingLayout = getRatingLayout(rating);

                                postsObj.push(post);
                            })

                            params.userPosts = postsObj;
                        }
        
                        res.render('userAccount', params);
                    });
                });

            } else {
                res.render('homepage',params);
            }
        });

    /* Popular */
    } else if (req.path.includes('popular')){

        params.popular = true;

        UserAccount.findOne({username: username}).populate('recipePost').
        exec((err, user) => {
            if(user) {

                // Save to params for Layout
                var userObj = user.toObject()

                params.dateJoined = getDate(user.dateJoined, 1)
                params.user = userObj;

                // Variables for ProfPic
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

                        // Checking if will Sort
                        var userPostIds = user.recipePost.map((doc) => {return doc._id});
                        var compare = ['1star','2star','3star','4star','5star'];
                        var sort = false;
                        var star = -1;

                        for(let i=0;i<5;i++)
                            if(req.path.includes(compare[i])){
                                sort = true;
                                star = parseInt(i+1);
                            }
                        // Checking if will sort ^

                        // If Will Sort
                        if(sort == true){

                            postFullModel.find({_id: {$in: userPostIds} ,pfNumberRating: star}).skip(skip)/* .limit(20) */.exec((err, posts) =>{
                                let postArray = [];

                                posts.forEach((doc) => {
                                    var post = doc.toObject();
                                    var rating = getRating(doc.pfRatings)

                                    post.pfDate = getDate(doc.pfDate,1);
                                    post.username = post.pfUser.username;
                                    post.ratingLayout = getRatingLayout(rating);

                                    postArray.push(post)
                                })

                                params.star = star
                                params.userPosts = postArray;
                                

                                res.render('userAccount', params);
                            });

                        // If Just Popular
                        } else {

                            postFullModel.find({_id: {$in: userPostIds} }).sort({pfNumberRating: -1}).skip(skip)/* .limit(20) */.exec((err, posts) => {

                                let postArray = [];

                                posts.forEach((doc) => {
                                    var post = doc.toObject();
                                    var rating = getRating(doc.pfRatings)

                                    post.pfDate = getDate(doc.pfDate,1);
                                    post.username = user.username;
                                    post.ratingLayout = getRatingLayout(rating);

                                    postArray.push(post)
                                })

                                params.userPosts = postArray;
                                
                                res.render('userAccount', params);
                            });
                        }
                    });
                });

            } else {
                res.render('homepage',params);
            }
        });
    }
}


module.exports.getUser = (req, res) => {

    //Others
    if (!req.isAuthenticated()) {
        res.redirect('/login?message=You need to log in first.');
    } else {
        var params = {
            layout: 'loggedIn',
            navProfPic: req.session.profPic,
        }

        if(req.path == '/createPost')
            res.render('createPost',params);

        else if(req.path == '/')
            res.render('homepage', params);

        //Getting the User Profile
        else if(req.path.includes('viewProfile')) {

            params.user = req.session.user;
            params.dateJoined = req.session.dateJoined;
            params.profPic = req.session.profPic;
            params.viewProfile = true;

            var userPostIds = req.session.userPostsId;
            var skip = (req.query.page - 1) * 15;

            if(req.path.includes('new')) {
                // Find the Post from array of posts in user account
                postFullModel.find({_id: {$in: userPostIds}}).sort({_id: -1})/* .limit(20) */.then(userPosts => {
                    var userPostsObj = [];

                    if(userPosts.length) {
                        // Object all the posts
                        userPosts.forEach(function(doc) {
                            var post = doc.toObject()
                            var date = post.pfDate
                            var rating = getRating(doc.pfRatings);

                            post.pfDate = getDate(date, 1);
                            post.ratingLayout = getRatingLayout(rating);
                            userPostsObj.push(post);
                        })

                        params.userPosts = userPostsObj
                        params.new = true
                    }
                
                    res.render('userAccount', params);
                });

            // Popular 
            } else if(req.path.includes('popular')) {

                params.layout = 'loggedIn';
                params.popular = true;

                // Checking if will Sort
                var compare = ['1star','2star','3star','4star','5star'];
                var sort = false;
                var star = -1;

                for(let i=0;i<5;i++)
                    if(req.path.includes(compare[i])){
                        sort = true;
                        star = parseInt(i+1);
                    }
                // Checking if will sort ^

                // If Will Sort
                if(sort == true){

                    postFullModel.find({_id: {$in: userPostIds} ,pfNumberRating: star}).skip(skip)/* .limit(20) */.exec((err, posts) =>{
                        let postArray = [];

                        posts.forEach((doc) => {
                            var post = doc.toObject();
                            var rating = getRating(doc.pfRatings)

                            post.pfDate = getDate(doc.pfDate,1);
                            post.username = post.pfUser.username;
                            post.ratingLayout = getRatingLayout(rating);

                            postArray.push(post)
                        })

                        params.star = star
                        params.userPosts = postArray;
                        

                        res.render('userAccount', params);
                    });

                // If Just Popular
                } else {

                    postFullModel.find({_id: {$in: userPostIds} }).sort({pfNumberRating: -1}).skip(skip)/* .limit(20) */.exec((err, posts) => {

                        let postArray = [];

                        posts.forEach((doc) => {
                            var post = doc.toObject();
                            var rating = getRating(doc.pfRatings)

                            post.pfDate = getDate(doc.pfDate,1);
                            post.username = req.session.user.username;
                            post.ratingLayout = getRatingLayout(rating);

                            postArray.push(post)
                        })

                        params.userPosts = postArray;
                        
                        res.render('userAccount', params);
                    });
                }
            }
        }
    }   
}


module.exports.homepage = (req, res) => {

    var pageNum = req.params.page || 1;
    var path = req.path
    var skip = (pageNum - 1) * 15;
    var totalPosts = postFullModel.countDocuments({});
    var totalPages = Math.ceil(totalPosts / 10)

    if(path.includes('new')) {

        // Calculation for pagination

        var params = {};

        postFullModel.find({}).sort({_id: -1}).skip(skip)/* .limit(20) */.populate('pfUser').
        then(posts => {
                
            let postObj = [];

            posts.forEach(function(doc){
                var post = doc.toObject()
                var date = post.pfDate
                var rating = getRating(doc.pfRatings)

                post.pfDate = getDate(date, 1);
                post.username = post.pfUser.username;
                post.ratingLayout = getRatingLayout(rating);

                postObj.push(post);
            });

            params.posts = postObj;
            params.currentPage = pageNum;
            params.new = true

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
    }

    // Popular 
     else if(req.path.includes('popular')){

        var params = {}

        // Checking if will Sort
        var compare = ['1star','2star','3star','4star','5star'];
        var sort = false;
        var star = -1;

        for(let i=0;i<5;i++)
            if(req.path.includes(compare[i])){
                sort = true;
                star = i+1;
                star = parseInt(star);
            }

        if(sort == true){

            postFullModel.find({pfNumberRating: star}).skip(skip)/* .limit(20) */.exec((err, posts) =>{
                let postArray = [];

                posts.forEach((doc) => {
                    var post = doc.toObject();
                    var rating = getRating(doc.pfRatings)

                    post.pfDate = getDate(doc.pfDate,1);
                    post.username = post.pfUser.username;
                    post.ratingLayout = getRatingLayout(rating);

                    postArray.push(post)
                })

                params.star = star
                params.posts = postArray;
                params.popular = true

                // Check if Logged in or not
                if(!req.user){
                    params.layout = 'main';
                }
                else {
                    params.layout = 'loggedIn';
                    params.navProfPic = req.session.profPic;
                }

                res.render('search', params);
            });

        } else {

            postFullModel.find({}).sort({pfNumberRating: -1}).skip(skip)/* .limit(20) */.populate('pfUser').exec((err, posts) => {

                let postArray = [];

                posts.forEach((doc) => {
                    var post = doc.toObject();
                    var rating = getRating(doc.pfRatings)

                    post.pfDate = getDate(doc.pfDate,1);
                    post.username = post.pfUser.username;
                    post.ratingLayout = getRatingLayout(rating);

                    postArray.push(post)
                })

                params.posts = postArray;
                params.popular = true

                // Check if Logged in or not
                if(!req.user){
                    params.layout = 'main';
                }
                else {
                    params.layout = 'loggedIn';
                    params.navProfPic = req.session.profPic;
                }

                res.render('search', params);
            });
        }
    }
}


module.exports.getPostFull = (req, res) => {
    const postId = req.params.postId;
    
    postFullModel.findById(postId).populate('pfUser')
    .exec((err, post) =>{
    
        if(post.pfImages == null)
            res.redirect('/');

        const filenames = post.pfImages;
    
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
            
            /**** rating *****/
            var rating = getRating(post.pfRatings);

            // For the layout
            var ratingLayout = getRatingLayout(rating);

            // Push to Model
            post.updateOne({pfNumberRating: rating}).exec(postUpdated => {

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
                
                    // User Who Post
                    poster = postObj.pfUser;
                
                    // Parameters
                    var params = {
                        pfImages: finalFile,
                        post: postObj,
                        datePosted: getDate(postObj.pfDate, 1),
                        poster: poster,
                        layout: '',
                        navProfPic: req.session.profPic,
                        comments: commentsObj,
                        rating: ratingLayout,
                        message: req.query.message
                    }
                
                    if(!req.isAuthenticated()){
                        params.layout = 'main';
                    } else {
                        params.layout = 'loggedIn'
                        params.loggedInUsername = req.session.user.username
                    }

                    res.render('postFull', params);
                })
            });
        })
    });
    });
}
    

module.exports.getEditPost = (req, res) => {

    postFullModel.findById(req.params.postId).exec((err, post) => {

        post = post.toObject()
    
        var params = {
            post: post,
            navProfPic: req.session.profPic,
            layout: 'loggedIn'
        }
        res.render('editPost', params)
    });
}

module.exports.updatePost = (req, res) => {
    const postId = req.params.postId

    var imagesToDelete = [req.body.imagesToDelete];

    var filenames = req.files.map(function(file) {
        return file.filename;
      })

    const newTempPost = {
      pfTitle: req.body.pfTitle,
      pfDescription: req.body.pfDescription,
      pfImages: filenames,
      pfIngredients: req.body.pfIngredients,
      pfDirections: req.body.pfDirections,
      pfTags: req.body.pfTags,
    }

    postFullModel.findByIdAndUpdate(postId, {$set: newTempPost}).exec((err, newPost) => {

        if(err) throw err;

        console.log(newPost);

        // Deleting the Image in files and chunks
        collection.find({ filename: {$in: imagesToDelete} }).toArray(function (err, docs) {

            if(err) throw err;

            console.log(docs);
            let imageList = docs.map(function(data){return data._id});

            // Remove The Old Photos
            collection.remove({ filename: {$in: imagesToDelete} });
            collectionChunks.remove({ files_id: {$in : imageList} });

            res.redirect(newPost.pfURL);
        });
    })
}

module.exports.getSearchResult = (req, res) =>{
    var searchTag = req.query.search

    var params = {
        searchTag: searchTag
    }

    if(req.path.includes('new')) {
        postFullModel.find({pfTags: {'$regex' : searchTag, '$options' : 'i'}}).sort({_id: -1})/* .limit(20) */.populate('pfUser').
        exec((err, posts) => {

            let postArray = [];

            posts.forEach((doc) => {
                var post = doc.toObject();
                var rating = getRating(doc.pfRatings)

                post.pfDate = getDate(doc.pfDate,1);
                post.username = post.pfUser.username;
                post.ratingLayout = getRatingLayout(rating);

                postArray.push(post)
            })

            params.posts = postArray
            params.new = true;

            // Check if Logged in or not
            if(!req.user){
                params.layout = 'main';
            }
            else {
                params.layout = 'loggedIn';
                params.navProfPic = req.session.profPic;
            }

            res.render('search', params);
        });
    }

    else if(req.path.includes('popular')){

        // Checking if will Sort
        var compare = ['1star','2star','3star','4star','5star'];
        var sort = false;
        var star = -1;

        for(let i=0;i<5;i++)
            if(req.path.includes(compare[i])){
                sort = true;
                star = i+1;
                star = parseInt(star);
            }

        if(sort == true){

            postFullModel.find({pfTags: {'$regex' : searchTag, '$options' : 'i'}, pfNumberRating: star})/* .limit(20) */.populate('pfUser').
            exec((err, posts) =>{
                let postArray = [];

                posts.forEach((doc) => {
                    var post = doc.toObject();
                    var rating = getRating(doc.pfRatings)

                    post.pfDate = getDate(doc.pfDate,1);
                    post.username = post.pfUser.username;
                    post.ratingLayout = getRatingLayout(rating);

                    postArray.push(post)
                })

                params.star = star
                params.posts = postArray;
                params.popular = true

                // Check if Logged in or not
                if(!req.user){
                    params.layout = 'main';
                }
                else {
                    params.layout = 'loggedIn';
                    params.navProfPic = req.session.profPic;
                }

                res.render('search', params);
            });

        } else {

            postFullModel.find({pfTags: {'$regex' : searchTag, '$options' : 'i'}}).sort({pfNumberRating: -1})/* .limit(20) */.exec((err, posts) => {

                let postArray = [];

                posts.forEach((doc) => {
                    var post = doc.toObject();
                    var rating = getRating(doc.pfRatings)

                    post.pfDate = getDate(doc.pfDate,1);
                    post.username = post.pfUser.username;
                    post.ratingLayout = getRatingLayout(rating);

                    postArray.push(post)
                })

                params.posts = postArray;
                params.popular = true

                // Check if Logged in or not
                if(!req.user){
                    params.layout = 'main';
                }
                else {
                    params.layout = 'loggedIn';
                    params.navProfPic = req.session.profPic;
                }

                res.render('search', params);
            });
        }
    }
}