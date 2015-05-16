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
                position: {type: String, enum: ['top'], default: 'top'},
                network: {type: String, default: 'instagram'},
                link: {type: String, default: 'http://instagram.com/'},
                logo: {type: String, default: '/uploads/instagram.png'},
                active: {type: Boolean, default: true}
            },
            topLeft: {
                position: {type: String, enum: ['topLeft'], default: 'topLeft'},
                network: {type: String, default: 'twitter'},
                link: {type:String, default: 'http://twitter.com/'},
                logo: {type: String, default: '/uploads/twitter.png'},
                active: {type: Boolean, default: true}
            },
            topRight: {
                position: {type: String, enum: ['topRight'], default: 'topRight'},
                network: {type:String, default: 'facebook'},
                link: {type:String, default: 'http://facebook.com/'},
                logo: {type: String, default: '/uploads/facebook.png'},
                active: {type: Boolean, default: true}
            },
            left: {
                position: {type: String, enum: ['left'], default: 'left'},
                network: {type:String, default: 'youtube'},
                link: {type:String, default: 'http://youtube.com/'},
                logo: {type: String, default: '/uploads/youtube.png'},
                active: {type: Boolean, default: true}
            },
            right: {
                position: {type: String, enum: ['right'], default: 'right'},
                network: {type:String, default: 'google'},
                link: {type:String, default: 'http://plus.google.com/'},
                logo: {type: String, default: '/uploads/google.png'},
                active: {type: Boolean, default: true}
            },
            bottom: {
                position: {type: String, enum: ['bottom'], default: 'bottom'},
                network: {type:String, default: 'flickr'},
                link: {type:String, default: 'http://flickr.com/'},
                logo: {type: String, default: '/uploads/flickr.png'},
                active: {type: Boolean, default: true}
            },
            bottomLeft: {
                position: {type: String, enum: ['bottomLeft'], default: 'bottomLeft'},
                network: {type:String, default: 'github'},
                link: {type:String, default: 'http://github.com'},
                logo: {type: String, default: '/uploads/github.png'},
                active: {type: Boolean, default: true}
            },
            bottomRight: {
                position: {type: String, enum: ['bottomRight'], default: 'bottomRight'},
                network: {type:String, default: 'linkedin'},
                link: {type:String, default: 'http://linkedin.com'},
                logo: {type: String, default: '/uploads/linkedin.png'},
                active: {type: Boolean, default: true}
            },
            centre: {
                position: {type: String, enum: ['centre'], default: 'centre'},
                network: {type:String, default: 'email'},
                link: {type:String, default: 'user@email.com'},
                logo: {type: String, default: '/uploads/email.png'},
                active: {type: Boolean, default: true}
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
