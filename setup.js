/**
 * Created by hrachyayeghishyan on 10/2/18.
 */
const mongoose = require('mongoose');
const Promise = require('bluebird');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

module.exports = function(app) {
    mongoose.Promise = Promise;
    mongoose.connect('mongodb://127.0.0.1:27017/nodeSessions', {connectTimeoutMS: 3000});

    var db = mongoose.connection;

    db.once('open', function() {
        console.log('connected to local instance of mongo');
    });


    app.db = {
      user_sessions: db.model('user_sessions'),
      users: db.model('users')
    };

    // var store = new MongoDBStore({
    //     uri: 'mongodb://localhost:27017/nodeSessions',
    //     collection: 'user_sessions'
    // });
    var store = new MongoDBStore({mongooseConnection: db});

    store.destroy = function(sid, cb) {
      app.db.user_sessions.remove({_id: sid}, function(err, doc) {
          if (err) {
              return cb(err);
          }
      });
    };

    store.get = function(sid, cb) {
     return app.db.user_sessions.findOne({_id: sid}, function(err, doc) {
        if (err) {
            return cb(err);
        }
        if (!doc) {
            return cb(null, null);
        }
        return cb(null, doc);
     });
    };

    store.set = function(sid, session, cb) {
        //how to handle the session in our case?
    };

    app.use(session({
        // genid: (req) => {
        //   console.log('inside the session middleware');
        //   return uuid();
        // },
        secret: 'segred',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
        },
        store: store,
        resave: true,
        saveUninitialized: true
    }));

};