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
    .before('post', hash_password)
    .before('put', hash_password);

    function hash_password(req, res, next) {

        // First check if all the required fields are not empty
        if (req.body.username == null || req.body.email == null || req.body.password == null
            || req.body.username == '' || req.body.email == '' || req.body.password == '') {

            return res.status(400).send('Incorrect data');
        }
        console.log("username: "+req.body.username+" email: "+req.body.email);
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

    // Return middleware
    return function(req, res, next) {
        next();
    }
};