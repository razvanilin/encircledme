var mongoose = require('mongoose');

// Create the Movie Schema
var ProfileSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	avatar: {
		type: String,
		default: 'default.png'
	},
	firstname: {
		type: String,
		default: 'Awesome'
	},
	lastname: {
		type: String,
		default: 'Name'
	},
	
});

// Export the mode schema
module.exports = ProfileSchema;