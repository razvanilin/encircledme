var restful = require('node-restful');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

module.exports = function(app, route) {

    // Setup the controller for REST
    var User = restful.model(
            'user',
            app.models.user
        ).methods(['get', 'put', 'post', 'delete'])
        // uncomment this in production
        //.before('get', expressJwt({ secret: app.settings.secret }))
        .before('post', hash_password)
        .before('put', expressJwt({
            secret: app.settings.secret
        }), checkForPassword);


    function checkForPassword(req, res, next) {
        if (req.body.password) return res.status(400).send("Bad request");

        next();
    }

    function hash_password(req, res, next) {

        // First check if all the required fields are not empty
        if (req.body.username == null || req.body.email == null || req.body.password == null || req.body.username == '' || req.body.email == '' || req.body.password == '') {

            return res.status(400).send('Incorrect data');
        }
        console.log("username: " + req.body.username + " email: " + req.body.email);
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                if (err) return next(err);
                req.body.password = hash;
                next();
            });
        });
    }

    // Register this endpoint with the application
    User.register(app, route);

    // Get the user profile
    app.get('/user/:username', function(req, res, next) {
        console.log(req.params.username);
        User.findOne({
            username: req.params.username
        }, function(err, data) {
            if (err || data === null)
                return res.status(404).send("User not found");
            else
                res.send(data.profile);
        });
    });


    // Change password route
    app.put('/user/:username/password', expressJwt({secret: app.settings.secret}), function(req, res, next) {
        var oldPassword = req.body.old;
        var newPassword = req.body.new;
        var username = req.params.username;

        if (oldPassword == '' || newPassword == '' || username == '') {
            return res.status(400).send('Bad Request');
        }

        User.findOne({
            username: username
        }, function(err, user) {
            if (err || user === null) {
                return res.status(404).send("User not found");
            }
            
            user.comparePassword(oldPassword, function(isMatch) {
                if (!isMatch) {
                    return res.status(401).send("Wrong password");
                }

                // if everything is fine, assign the new password to the password field
                req.body.password = newPassword;

                // hash the password
                bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                    if (err) return next(err);

                    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                        if (err) return next(err);
                        user.password = hash;
                    });
                });

                // save the new password
                user.save(function(err) {
                    if (err) {
                        return res.status(400).send("Could not update");
                    } else {
                        return res.status(200).send("User Updated");
                    }
                });

            });
        });
    });

    // Return middleware
    return function(req, res, next) {
        next();
    }
};