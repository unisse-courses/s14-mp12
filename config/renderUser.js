const getDb = require('./db').getDb;
const UserAccount = require('../models/userAccountModel');
const postFullModel = require('../models/postFullModel');

// Variables
const db = getDb();

const collection = db.collection('uploads.files');
const collectionChunks = db.collection('uploads.chunks');



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
                                
                                var user = JSON.parse(JSON.stringify(result));
                          
                                var params = {
                                    layout: 'loggedIn',
                                    isUser: true,
                                    user: user,
                                    profPic: finalFile
                                }

                                req.session.profPic = finalFile

                                res.render('userAccount', params);
                            });
                        }
                    });
                }
            });
    }
}

module.exports.getProfPic = (req, res) => {
    
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        var params = {
            layout: 'loggedIn',
            profPic: req.session.profPic
        }

        if(req.path == '/createPost')
            res.render('createPost',params);
        else if(req.path == '/')
            res.render('homepage', params)
    }
}

module.exports.getPostFull = (req, res) => {
    const postId = req.params.postId;
    
    postFullModel.findById(postId)
    .populate('ratings')
    .populate('comments')
    .exec((err, post) =>{
        if (err) throw err;
        if(post.pfImages == null || post.pfImages == undefined) {
            console.log('Debug')
            res.redirect('/');
        }
        
        const filenames = post.pfImages;
        console.log(filenames)
    
        collection.find({ filename: {$in: filenames} }).toArray(function (err, docs) {
            if (err) throw err;
            // Uncomment to see the data returned
            docs.forEach((data) => {
                console.log(data);
            });
        
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


            var userId = postObj.pfUserId;
            UserAccount.findById(userId, (err, poster) => {

                poster = poster.toObject();
                // Rating
                // var totalRating = 0;
                // for(let i = 0; i < post.pfRatings.size; i++)
                //     totalRating += post.pfRating[i].numRating;
                // totalRating /= post.pfRatings.size;

                //
            
                var params = {
                    pfImages: finalFile,
                    post: postObj,
                    poster: poster,
                    // rating: totalRating,
                    layout: '',
                    partial: '',
                    profPic: req.session.profPic
                }

                if(!req.isAuthenticated()){
                    params.layout = 'main';
                    params.partial = 'loggedOutNav1'
                } else {
                    params.layout = 'loggedIn'
                }

                res.render('postFull', params);
            });
        });
    });
    })
}
    