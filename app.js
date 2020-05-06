/*Packages*/
// Express
const express = require('express');
const app = express();

// HBS
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const moment = require('moment');   //Moment

// Parser
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Mongoose 
const mongoose = require('mongoose');
mongoose.set('debug', true);

// Path
const path = require('path');

// DB connection
require('dotenv/config');

// Session
const passport = require('passport');

// config
require('./config/passport')(passport);
const initDb = require("./config/db").initDb;
const getDb = require("./config/db").getDb;

/*Middlewares*/
// use css files
app.use(express.static(__dirname + '/public'));

// use parser
const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// use session
app.use(cookieParser("session"));
app.use(require("express-session")({    
    secret:"session",    
    resave: true,    
    saveUninitialized: true,
    cookie: {
	    httpOnly: true,
	    expires: cookieExpirationDate
	}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    if (req.user) {
        res.locals.photo = req.user.profPic;
    }

    //For Number of Post in Home Page

    next();
});

// use hbs
app.set('view engine', 'hbs');

app.engine('hbs', exphbs({
    extname: 'hbs', // configures the extension name to be .hbs instead of .handlebars
    defaultView: 'main', // this is the default value but you may change it to whatever you'd like
    layoutsDir: path.join(__dirname, '/views/layouts'), // Layouts folder
    partialsDir: path.join(__dirname, '/views/partials'), // Partials folder

    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        'notNull': function (value, options) {

            if (!handlebars.Utils.isArray(value)) {
                return [];
            } else {
                return value.filter(function (ele) {
                    return !handlebars.Utils.isEmpty(ele);
                });
            }
        },
        'formatToYear': function (dateTime) {
            return moment(dateTime).format('YYYY');
        },
        'formatDate': function (dateTime) {
            return moment(dateTime).format('MMMM DD, YYYY');
        },
        // experimenting
        ifEqual: function (var1, var2) {
            return (var1 == var2);
        }
    }
}));

// port
const port = 3000;
initDb(function (err) {
    app.listen(port, function (err) {
        if (err) {
            throw err;
        }
        console.log("API Up and running on port " + port);
        //ROUTES

        app.get('/', (req, res) => {
            res.redirect('/new');
        })

        // Home Page (New)
        app.get('/new', (req, res) => {
            const viewUser = require('./config/controller');
            viewUser.homepage(req,res);
        })

        // Home Page (Popular)
        app.get('/popular', (req, res) => {
            const viewUser = require('./config/controller');
            viewUser.homepage(req,res);
        })

        // Import Routes
        app.use('/', require('./routes/userRoute'));
        app.use('/', require('./routes/commentRoute'));
        app.use('/', require('./routes/ingredientRoute'));
        app.use('/', require('./routes/ratingRoute'));
        app.use('/', require('./routes/postRoute'));

        app.get('/search', function (req, res) {
            res.render('search')
        })
    });
}); 