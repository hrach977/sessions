/**
 * Created by hrachyayeghishyan on 10/2/18.
 */
const mongoose = require('mongoose');
const Promise = require('bluebird');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); //het berel ira ameninchov
//const SessionStore = require('connect-mongoose-session-store')(session);
//const MongooseStore = require('connect-mongoose-session');

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

    // var store = new SessionStore({
    //    host: 'localhost',
    //    port: 27017,
    //    db: 'nodeSessions',
    //    stringify: false,
    //    maxAge: 60 * 60 * 1000,
    //    autoRemoveExpiredSession: true
    // });

    // var store = new MongoDBStore({
    //     uri: 'mongodb://localhost:27017/nodeSessions',
    //     collection: 'user_sessions'
    // });

    //het berel
    //var store = new MongoDBStore({mongooseConnection: db, collection: 'user_sessions'});

    // var options = {
    //   uri: 'mongodb://127.0.0.1:27017/nodeSessions',
    //   collection: 'user_sessions'
    // };
    //
    // var store = new MongoDBStore(options);

    //console.log(store.collection);

    // store.destroy = function(sid, cb) { //is called inside logout
    //     // This destroys the session doc from db, but the session id is not changed for subsequent logins
    //     console.log('now store.destroy is called');
    //   app.db.user_sessions.deleteOne({session_id: sid}, function(err, doc) {
    //       if (err) {
    //           return cb(err);
    //       }
    //   });
    // };
    //
    // store.set = function(sid, session, cb) {
    //     console.log('now store.set is called');
    //   // app.db.user_sessions.create({
    //   //     session_id: sid,
    //   //     session: session
    //   // }, function(err) {
    //   //       if(err) {
    //   //           return cb(err);
    //   //       }
    //   // });
    //     var document = app.db.user_sessions();
    //     document.session_id = sid;
    //     //document.user_id = user._id;
    //     document.created = new Date();
    //     document.session = JSON.parse(JSON.stringify(session));
    //     document.save();
    // };

    // store.get = function(sid, cb) {
    //     console.log('now store.get is called');
    //     app.db.user_sessions.findOne({session_id: sid}, function(err, doc) {
    //         if (err) {
    //             console.log('err in store.get is: ' + err);
    //             return cb(err);
    //         }
    //         if (!doc) {
    //             return cb(null, null);
    //         }
    //         return cb(null, doc.session); //used to pass doc.session
    //
    //     });
    // };

    // store.get = function(sid, cb) {
    //  return app.db.user_sessions.findOne({session_id: sid}, function(err, doc) {
    //     if (err) {
    //         return cb(err);
    //     }
    //     if (!doc) {
    //         return cb(null, null);
    //     }
    //     return cb(null, doc);
    //  });
    // };

    // store.set = function(sid, session, cb) {
    //     //how to handle the session in our case?
    // };

    app.use(session({
        // genid: (req) => {
        //   console.log('inside the session middleware');
        //   return uuid();
        // },
        secret: 'segred',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
        },
        //store: store,
        store: new MongoDBStore(
            {
                uri: 'mongodb://localhost:27017/nodeSessions',
                collection: 'user_sessions'
            }
        ),
        resave: true,
        saveUninitialized: false  //pay attention to this parameter
    }));

};