/**
 * Created by hrachyayeghishyan on 10/2/18.
 */
const passport = require('passport');

module.exports = function(app) {

    app.get('/sessions', function(req, res, next) {
       app.db.user_sessions.find({}, function(err, sessions) {
          if (sessions) {
              console.log(sessions);
              res.send(sessions);
          }
       });
    });

    app.get('/users', function(req, res, next) {
       app.db.users.find({}, function(err, users) {
         if (users) {
             console.log(users);
             res.send(users);
         }
       });
    });

    app.get('/console', function(req, res, next) {
       console.log('endpoint works');
    });

    app.post('/reset-password', function(req, res, next) {

    });

    app.get('/', function(req, res, next) {
        console.log('session id inside /: ' + req.session.id);
        //console.log('user inside / id: ' + req.user); //undefined
        app.db.user_sessions.findOne({session_id: req.session.id}, function(err, doc) {
            if (doc) {
                console.log('id of the user in / is: ' + doc.user_id);
            }
        });
       res.render('index');
    });

    app.get('/login', function(req, res, next) {
        console.log('session id inside login get is: ' + req.session.id);
        res.render('login');
    });

    app.post('/login', function(req, res, next) {
        console.log('post worked');
        console.log('session is: %j', req.session);
        passport.authenticate('local', function(err, user, info) {
            console.log('insider authenticate callback');
            //console.log(req.username);
            //console.log(req.password);

            console.log('session is: %j', req.session);
            console.log('sessions id inside login is: ' + req.session.id);
            if (err) console.log(err);
            if (user) {
                console.log('user is: ' + user);
                req.user = user;
            }
            if (info) console.log(info);

            var document = app.db.user_sessions();
            document.session_id = req.session.id;
            document.user_id = user._id;
            document.created = new Date();
            document.session = JSON.parse(JSON.stringify(req.session));
            document.save();

            res.redirect("/")

        })(req, res, next);
    });

    app.get('/reset', function(req, res, next) {
        console.log('session id inside /reset: ' + req.session.id);
       res.render('reset');
    });

    app.post('/reset', function(req, res, next) {
       console.log('session id inside reset is: ' + req.session.id);

       // app.db.user_sessions.findOne({session_id: req.session.id}, function(err, doc) {
       //      console.log('the current users username is: ' + doc.user_id);
       //  });

        app.db.user_sessions.findOne({session_id: req.session.id}, null, null, function(err, doc) {
            console.log('the current users id is: ' + doc.user_id);
            app.db.user_sessions.remove({user_id: doc.user_id, session_id: {$not: req.session.id}});
            app.db.users.findOneAndUpdate({_id: doc.user_id}, {password: req.password});
        });



       //app.db.user_sessions.find
    });

    app.get('/logout', function(req, res, next) {
        console.log('session id inside /logout: ' + req.session.id);
        req.session.destroy();
       req.logout();
       //console.log('session id inside /logout after destroying the session: ' + req.session.id); cannot read property id of undefined
       res.redirect('/login');
    });


};