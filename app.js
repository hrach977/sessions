/**
 * Created by hrachyayeghishyan on 10/2/18.
 */
const express = require('express');
//const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const uuid = require('uuid/v4');
//const MongoDBStore = require('connect-mongodb-session')(session);


var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// var store = new MongoDBStore({
//     uri: 'mongodb://localhost:27017/nodeSessions',
//     collection: 'user_sessions'
// });

//app.use(express.cookieParser());
app.use(express.json());
app.use(flash());
app.listen(3000, function() {
    console.log('listening on port 3000');
});

app.set('view engine', 'ejs');

// app.use(session({
//     // genid: (req) => {
//     //   console.log('inside the session middleware');
//     //   return uuid();
//     // },
//     secret: 'segred',
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
//     },
//     store: store,
//     resave: true,
//     saveUninitialized: true
// }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('the strategy');
        console.log(username);
        console.log(password);
        app.db.users.findOne({username: username}, function (err, doc) {
            if (err) return done(err);

            if (!doc) return done(null, false, {message: 'No such user'});

            if (doc.password != password) return done(null, false, {message: 'Wrong password'});

            return done(null, doc);
        });
    }

));

require('./models/users');
require('./models/user_sessions');
require('./setup')(app);
require('./controllers/api')(app);

