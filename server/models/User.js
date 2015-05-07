var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Create the Movie Schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        avatar: {
            type: String,
            default: '/uploads/default.png'
        },
        firstname: {
            type: String,
            default: 'Awesome'
        },
        lastname: {
            type: String,
            default: 'Name'
        },
        social: {
            top: {
                network: {type: String, default: 'instagram'},
                link: {type: String, default: 'http://instagram.com/'}
            },
            topLeft: {
                network: {type: String, default: 'twitter'},
                link: {type:String, default: 'http://twitter.com/'}
            },
            topRight: {
                network: {type:String, default: 'facebook'},
                link: {type:String, default: 'http://facebook.com/'}
            },
            left: {
                network: {type:String, default: 'youtube'},
                link: {type:String, default: 'http://youtube.com/'}
            },
            right: {
                network: {type:String, default: 'google'},
                link: {type:String, default: 'http://plus.google.com/'}
            },
            bottom: {
                network: {type:String, default: 'flickr'},
                link: {type:String, default: 'http://flickr.com/'}
            },
            bottomLeft: {
                network: {type:String, default: 'github'},
                link: {type:String, default: 'http://github.com'}
            },
            bottomRight: {
                network: {type:String, default: 'linkedin'},
                link: {type:String, default: 'http://linkedin.com'}
            },
            centre: {
                network: {type:String, default: 'email'},
                link: {type:String, default: 'user@email.com'}
            }
        }
    },
    uploads: []
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

// Export the mode schema
module.exports = UserSchema;
