var restful = require('node-restful');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var secret = 'nightingale';

module.exports = function(app, route) {

    // Setup the controller for REST
    var User = restful.model(
        'user',
        app.models.user
    ).methods(['get', 'put', 'post', 'delete']
    ).before('post', hash_password
    ).before('put', hash_password
    ).route('profile/:username', {
        handler: function(req, res, next, err, model) {
        	console.log("yoyo");
        	User.Model.find({ username: req.username}, function(err, list) {
        		if (err) return next({status: 500, err: "Something went wrong. Fix it."});

        		res.status(200);
        		res.bundle = list.profile;
        		return next();
        	});
        },
        detail: true,
        methods: ['get']
    });

    function hash_password(req, res, next) {

        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(req.body.password, salt, function(err, hash) {
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
    	User.findOne({ username: req.params.username}, function(err, data) {
    		res.send(data.profile);
    	});
    });

    // Return middleware
    return function(req, res, next) {
        next();
    }
};