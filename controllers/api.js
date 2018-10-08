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
       res.render('index');
    });

    app.get('/login', function(req, res, next) {
        res.render('login');
    });

    app.post('/login', function(req, res, next) {
        console.log('post worked');
        console.log('sessions is: ' + req.session);
        passport.authenticate('local', function(err, user, info) {
            console.log('insider authenticate callback');
            console.log(req.username);
            console.log(req.password);

            console.log('sessions is: ' + req.session);
            console.log('sessions id inside login is: ' + req.session.id);
            if (err) console.log(err);
            if (user) console.log('user is: ' + user);
            if (info) console.log(info);

            var document = app.db.user_sessions();
            document.session_id = req.session.id;
            document.user_id = user._id;
            document.created = new Date();
            document.save();

            res.redirect("/")

        })(req, res, next);
    });

    app.get('/reset', function(req, res, next) {
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
       req.logout();
       res.redirect('/');
    });


};