const assert = require("assert");
const mongoose = require("mongoose");

let _db;
module.exports = {
    getDb,
    initDb
};

function initDb(callback) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null, _db);
    }
mongoose.connect('mongodb+srv://user:pAssword@recipeep-nxraf.mongodb.net/recipeepdb',{ useNewUrlParser: true, useUnifiedTopology: true},connected)
function connected(err, db) {
        if (err) {
            return callback(err);
        }
        console.log("DB initialized " + mongoose.connection.readyState);
        _db = db;
        return callback(null, _db);
    }
}

function getDb() {
    assert.ok(_db, "Db has not been initialized. Please call init first.");
    return _db;
}