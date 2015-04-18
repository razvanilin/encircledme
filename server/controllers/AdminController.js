var restful = require('node-restful');
var expressJwt = require('express-jwt');
var secret = 'nightingale';

module.exports = function(app, route) {

	// Setup the controller for REST
	app.get('/admin', expressJwt({secret: secret}), function(req, res) {
		console.log(req.user.profile + " is now admin");
		return res.send(req.user);
	});

	/*function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.sendStatus(401);
	}*/

	// Return middleware
	return function(req, res, next) {
		next();
	}
};