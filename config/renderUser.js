const getDb = require('./db').getDb;
const UserAccount = require('../models/userAccountModel');

module.exports.renderUser = (req, res) => {
    const db = getDb();

    const collection = db.collection('uploads.files');
    const collectionChunks = db.collection('uploads.chunks');

    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        const fileName = res.locals.photo;
        var userId = req.session.passport.user;
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
                                    layout: 'loggedIn',
                                    isUser: true,
                                    user: user,
                                    date: date,
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

module.exports.viewCreatePost = (req, res) => {
    const db = getDb();

    const collection = db.collection('uploads.files');
    const collectionChunks = db.collection('uploads.chunks');

    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        const fileName = res.locals.photo;
        var userId = req.session.passport.user;
        console.log(userId);
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

                        res.render('createPost',params);
                    });
                });
            });
    }
}