//Import 
const registerModel = require("../models/userAccountModel");


// Create User
exports.create = function(req, res){
    //Register Function Here
    // I think this is still kulang
    const userAcct = new UserAccount({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profPic: req.file.filename,
        description: req.body.description,
    });

    registerModel.create(userAcct, function(err, userAcct) {
        var result;
  
        if (err) {
            console.log(err.errors);
  
            result = { success: false, message: "User was not created!" }
            res.send(result);
        } else {
            console.log(userAcct);
  
            result = { success: true, message: "User created!" }
  
            res.send(result);
        }
    });
}