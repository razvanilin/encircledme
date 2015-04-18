module.exports = {
	'/movie': require('./controllers/MovieController'),
	'/user' : require('./controllers/UserController'),
	'/login' : require('./controllers/LoginController'),
	'/admin' : require('./controllers/AdminController')
};