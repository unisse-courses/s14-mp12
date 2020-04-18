// Imports
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
require('dotenv/config');

// Creates the express application
const app = express();
const port = 3000;

app.set('view engine', 'hbs');

app.engine('hbs', exphbs({
    extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
    defaultView: 'main', // this is the default value but you may change it to whatever you'd like
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder

    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        'notNull': function(value, options) {
    
            if(!handlebars.Utils.isArray(value)){
                return [];
            } else {
                return value.filter(function(ele){
                    return !handlebars.Utils.isEmpty(ele);
                });
            }
        },
        'formatToYear': function(dateTime) {
            return moment(dateTime).format('YYYY');
        },
        'formatDate': function(dateTime) {
            return moment(dateTime).format('MMMM DD, YYYY');
        }
    }
}));


// Configuration for handling API endpoint data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/**Routes**/
app.get('/', function (req, res) {
    res.render('homepage')
});

// Import Routes
app.use('/', require('./routes/userRoute'));
app.use('/', require('./routes/commentRoute'));
app.use('/', require('./routes/ingredientRoute'));
app.use('/', require('./routes/ratingRoute'));
app.use('/', require('./routes/postRoute'));

app.get('/login', function (req, res) {
    res.render('login')
});

app.get('/search', function (req, res) {
    res.render('search')
});

app.get('/postFull', function (req, res) {
    res.render('postFull')
});

/**Use static files**/
app.use(express.static('public'));

/**Listen to the server**/
app.listen(port, function () {
    console.log('App listening at port ' + port)
});

