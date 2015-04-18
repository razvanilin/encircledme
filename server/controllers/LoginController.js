var restful = require('node-restful');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var RememberMeStrategy = require('passport-remember-me').Strategy;
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

module.exports = function(app, route) {

    app.use(passport.initialize());
    app.use(passport.session());
    //app.use(passport.authenticate('remember-me'));

    var User = mongoose.model('User', app.models.user);

    // Setting up the Remember Me strategy
    /*passport.use(new RememberMeStrategy(
        function(token, done) {
            Token.consume(token, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        },
        function(user, done) {
            var token = utils.generateToken(64);
            Token.save(token, {
                userId: user.id
            }, function(err) {
                if (err) {
                    return done(err);
                }
                return done(null, token);
            });
        }
    ));*/

    // Create the middleware
    app.post('/login', function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            return res.status(401).send('Wrong username or password');
        }

        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                console.log(err);
                return res.send(401, 'Wrong username (dev)');
            }

            user.comparePassword(password, function(isMatch) {
                if (!isMatch) {
                    console.log("Failed to login with " + user.username);
                    return res.status(401).send('Wrong password (dev)');
                }

                var profile = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profile: user.profile
                };

                var token = jwt.sign(profile, app.settings.secret, {
                    expiresInMinutes: 60 * 5
                });

                // check if remember me was ticked
                if (req.body.rememberme) {
                    console.log('remember me');
                    res.cookie('rememberme', token, {httpOnly: true, maxAge: 604800000});
                }

                console.log('Log in successfull as ' + user.username);
                res.json({
                    username: user.username,
                    token: token
                });
            });
        });
    });

    //app.use(passport.initialize());
    //app.use(passport.session());
    //console.log(app.model);

    /*var User = mongoose.model('User', app.models.user);

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user ' + username
                });
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
            });
        });
    }));

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                //res.status(401);
                return next(err);
            }

            if (!user) {
                console.log(info.message);
                
                req.session.messages = [info.message];
                return res.sendStatus(401);
            }
            req.logIn(user, function(err) {
                if (err) {
                    res.status(401);
                    return next(err);
                }

                if (req.body.rememberme) {
                    req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
                    console.log("lots of cookies");
                } else {
                    req.session.cookie.expires = false;
                    console.log("no cookies");
                }

                var profile = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar
                };

                var token = jwt.sign(profile, secret, {
                    expiresInMinutes: 60 * 5
                });
                res.json({
                    username: user.username,
                    token: token
                });

                console.log("Log in successfull");
                res.status(200);
                return res.send(user);
            });
        })(req, res, next);
    });*/

    app.get('/logout', function(req, res) {
        req.logout();
        res.send("Log out");
    });

    // Return middleware
    return function(req, res, next) {
        next();
    }
};