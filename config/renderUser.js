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
        const fileName = res.locals.photo;
        var userId = req.session.passport.user;
        UserAccount.findById(userId)
            //.populate('', '')
            .exec(function (err, result) {
                collection.find({ filename: fileName }).toArray(function (err, docs) {
                    console.log(docs._id + " id");
                    collectionChunks.find({ files_id: docs[0]._id }).sort({ n: 1 }).toArray(function (err, chunks) {
                        let fileData = [];
                        for (let i = 0; i < chunks.length; i++) {

                            //This is in Binary JSON or BSON format, which is stored
                            //in fileData array in base64 endocoded string format
                            fileData.push(chunks[i].data.toString('base64'));
                        }
                        let finalFile = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                        
                        var params = {
                            layout: 'loggedIn',
                            profPic: finalFile
                        }

                        if(req.path == '/createPost')
                            res.render('createPost',params);
                        else if(req.path == '/')
                            res.render('homepage', params)
                    });
                });
            });
    }
}

module.exports.getPostFull = (req, res) => {
    const postId = req.params.postId;

    postFullModel.findById(postId)
    .populate('ratings')
    .populate('comments')
    .exec((err, post) =>{
        if(err) throw err

        const filenames = post.pfImages;
        console.log("filenames: " + filenames)

        collection.find({ filename: {$in: filenames} }, function (err, docs) {
            if (err) throw err;
            console.log("docs: " + docs)

            let imageList = docs.map(function(data){return data._id});

            console.log("imageList: " + imageList)

            collectionChunks.find({ files_id: {$in: imageList} }, function (err, chunks) {
                if(err) throw err;

                let fileData = chunks.map(function(data){return data.chunks});
                let finalFile = [];

                for(let j = 0; j < fileData.length; j++)
                {
                    console.log("fileData.chunks.length: " + fileData.chunks[j].length)
                    for (let i = 0; i < fileData.chunks[j].length; i++) {

                        //This is in Binary JSON or BSON format, which is stored
                        //in fileData array in base64 endocoded string format
                        fileData.push(chunks[i].data.toString('base64'));
                    }
                    finalFile[j] = 'data:' + imageList[j][0].contentType + ';base64,' + fileData.join('');
                    console.log("finalFile[" + j + "]: "  + finalFile[j])
                }

                var params ={
                    pfImages: finalFile,
                    post: post,
                    layout: ''
                }
                
                // if(!req.isAuthenticated()){
                //     params.layout = 'main';
                //     res.render('postFull', params)
                // }else {
                //     params.layout = 'loggedIn'
                //     res.render('postFull', params)
                // }

            });
        });
    })
}