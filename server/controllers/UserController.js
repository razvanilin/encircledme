var mongoose = require('mongoose');
var expressJwt = require('express-jwt');
var bcrypt = require('bcrypt-nodejs');
var busboy = require('connect-busboy');
var path = require('path');
var fs = require('fs-extra');
var mkdir = require('mkdirp');
var md5 = require('MD5');

var SALT_WORK_FACTOR = 10;

module.exports = function(app, route) {

    app.use(busboy());

    // Setup the controller for REST
    var User = mongoose.model('user', app.models.user);

    /*
     * GET account details of all users (ADMIN)
     */
    app.get(app.settings.apiRoute + '/user', expressJwt({
            secret: app.settings.secret
        }),
        function(req, res, next) {
            if (req.user.isAdmin) {
                User.find({}, function(err, users) {
                    return res.status(200).send(users);
                });
            } else {
                return res.status(401).send("Action not authorized.");
            }
        });

    /*
     *  GET account details from one id
     */
    app.get(app.settings.apiRoute + '/user/:id', expressJwt({
            secret: app.settings.secret
        }),
        function(req, res, next) {
            if (req.user.isAdmin || req.user._id == req.params.id) {
                User.findOne({
                    _id: req.user._id
                }, function(err, user) {
                    if (err) return res.status(404).send("User not found.");

                    return res.status(200).send(user);
                });
            } else {
                return res.status(401).send("Action not authorized");
            }
        });

    // temporary route
    // TODO: find a way to disable the token authorisation on POST /user only
    app.post(app.settings.apiRoute + '/user/signup', hash_password);

    // Get the user profile
    app.get(app.settings.apiRoute + '/user/:username/profile', function(req, res, next) {
        console.log(req.params.username);
        User.findOne({
            username: req.params.username
        }, function(err, data) {
            if (err || data === null) {
                console.log(err);
                console.log(data);
                return res.status(404).send("User not found");
            } else
                res.send(data.profile);
        });
    });

    /*
     * Change public information
     */
    app.put(app.settings.apiRoute + '/user/:id', expressJwt({
            secret: app.settings.secret
        }),
        function(req, res, next) {
            if (req.user._id == req.params.id) {
                User.findOne({
                    _id: req.user._id
                }, function(err, user) {
                    if (err || user === null) return res.status(404).send("User not found.");
                    console.log(user);
                    user.profile.firstname = req.body.profile.firstname;
                    user.profile.lastname = req.body.profile.lastname;
                    user.email = req.body.email;

                    // save the new user
                    user.save(function(err) {
                        if (err) return res.status(400).send("User could not be updated");

                        return res.status(200).send("User updated");
                    });
                });
            }
        });


    /*
     * Change password route
     */
    app.put(app.settings.apiRoute + '/user/:username/password', expressJwt({
        secret: app.settings.secret
    }), function(req, res, next) {
        //console.log(req.user.profile);

        var oldPassword = req.body.old;
        var newPassword = req.body.new;
        var username = req.user.username;

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
                    return res.status(400).send("Wrong password");
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


    /*
     * set new avatar
     */
    app.put(app.settings.apiRoute + '/user/:username/avatar', expressJwt({
        secret: app.settings.secret
    }), function(req, res, next) {
        User.findOne({
            username: req.user.username
        }, function(err, user) {
            if (err || user === null) {
                return res.status(404).send("User not found");
            }

            if (user.uploads.indexOf(req.body.newAvatar) < 0) {
                return res.status(404).send("Avatar not found on the server");
            }

            if (req.body.requestType == "change") {

                user.profile.avatar = req.body.newAvatar;
                user.save(function(err) {
                    if (err) {
                        return res.status(400).send("Could not change avatar");
                    } else {
                        return res.status(200).send("Avatar changed");
                    }
                });

                // if type is delete, then delete the pic from the server and db
            } else if (req.body.requestType == "delete") {
                var file = __dirname + '/../' + req.body.newAvatar;
                fs.unlink(file, function(err) {
                    if (err) return res.status(400).send('picture could not be deleted');

                    var index = user.uploads.indexOf(req.body.newAvatar);
                    user.uploads.splice(index, 1);

                    // set the default avatar if the current profile picture was removed
                    if (user.profile.avatar == req.body.newAvatar) {
                        user.profile.avatar = app.settings.defaultPicture;
                    }

                    user.save(function(err) {
                        if (err) {
                            return res.status(400).send("Could not remove picture");
                        } else {
                            return res.status(200).send(req.body.newAvatar);
                        }
                    });

                });
            }
        });
    });


    /*
     * Avatar upload route
     */

    app.post(app.settings.apiRoute + '/user/:username/avatar', expressJwt({
        secret: app.settings.secret
    }), function(req, res, next) {

        var uploadPath = "";

        User.findOne({
            username: req.user.username
        }, function(err, user) {
            if (err || user === null) {
                console.log("user");
                return res.status(404).send("User not found");
            }
            if (user.uploads.length >= app.settings.maxImages) {
                return res.status(403).send("Maximum number of pictures reached: " + app.settings.maxImages);
            }

            req.pipe(req.busboy);
            req.busboy.on('file', function(fieldname, file, filename) {
                mkdir(__dirname + '/../uploads/' + req.user.username, function(err) {
                    if (err) console.error(err);

                    var hashDate = Date.now();
                    var fileExtension = filename.substring(filename.lastIndexOf('.'));

                    filename = md5(hashDate + filename) + fileExtension;

                    uploadPath = '/uploads/' + req.user.username + '/' + filename;
                    var stream = fs.createWriteStream(__dirname + '/../uploads/' + req.user.username + '/' + filename);
                    file.pipe(stream);
                    stream.on('close', function() {
                        console.log('File ' + filename + ' is uploaded');

                        if (user.uploads.length >= app.settings.maxImages) {
                            return res.status(403).send("Maximum number of pictures reached: " + app.settings.maxImages);
                        }

                        // Update the database with the avatars paths
                        user.uploads.push(uploadPath);
                        user.save(function(err) {
                            if (err) {
                                return res.status(400).send("Could not add image");
                            } else {
                                return res.status(200).send(uploadPath);
                            }
                        });
                    });

                });
            });
        });
    });

    /*
     * Network pictures upload route
     */

    app.post(app.settings.apiRoute + '/user/:username/network/:position', expressJwt({
        secret: app.settings.secret
    }), function(req, res, next) {

        var uploadPath = "";

        User.findOne({
            username: req.user.username
        }, function(err, user) {
            if (err || user === null) {
                console.log("user");
                return res.status(404).send("User not found");
            }

            // Only one upload per network is allowed
            // check to see if there was an upload already and delete it
            // if the network icon path has the username inside it, that means there is an upload already there
            if (user.profile.social[req.params.position].logo.indexOf(user.username) > -1) {
                console.log('file exists');
                var existingLogo = __dirname + '/../' + user.profile.social[req.params.position].logo;
                fs.unlink(existingLogo, function(err) {
                    if (err) return res.status(400).send('Logo could not be deleted');
                    console.log('file deleted');
                });
            }

            // create a folder inside the user directory and upload the new file there
            req.pipe(req.busboy);
            req.busboy.on('file', function(fieldname, file, filename) {
                mkdir(__dirname + '/../uploads/' + req.user.username + '/networks', function(err) {
                    if (err) console.error(err);

                    var hashDate = Date.now();
                    var fileExtension = filename.substring(filename.lastIndexOf('.'));

                    filename = md5(hashDate + filename) + fileExtension;

                    uploadPath = '/uploads/' + req.user.username + '/networks/' + filename;
                    var stream = fs.createWriteStream(__dirname + '/..' + uploadPath);
                    file.pipe(stream);
                    stream.on('close', function() {
                        console.log('File ' + filename + ' is uploaded');

                        // Update the database with the avatars paths
                        user.profile.social[req.params.position].logo = uploadPath;
                        user.save(function(err) {
                            if (err) {
                                return res.status(400).send("Could not add image");
                            } else {
                                return res.status(200).send(uploadPath);
                            }
                        });
                    });

                });
            });
        });
    });


    /*
     * Update networks
     */
    app.put(app.settings.apiRoute + '/user/:username/network', expressJwt({
        secret: app.settings.secret
    }), function(req, res, next) {
        User.findOne({
            username: req.user.username
        }, function(err, user) {
            if (err || user === null) {
                return res.status(404).send("User not found");
            }

            user.profile.social = req.body.social;
            user.save(function(err) {
                if (err) {
                    return res.status(400).send("could not update user");
                } else {
                    return res.status(200).send("network updated");
                }
            });
        });
    });

    /*
     *  Route used for setting the application admin
     *  When there are no admin on the application any registered user can use this route to make himself an admin
     *  This should be run by the application administrator
     */
    app.put(app.settings.apiRoute + '/user/admin/main', expressJwt({
        secret: app.settings.secret
    }), function(req, res, next) {
        var adminSet = false;
        // first check to see if there are no admins
        User.findOne({
            isAdmin: true
        }, function(err, user) {
            if (err || user === null) {
                // there are no admins ... proceed
                User.findOne({
                    username: req.user.username
                }, function(er, admin) {
                    if (err) return res.status(404).send("User not found");
                    admin.isAdmin = true;
                    admin.save(function(error) {
                        if (error) {
                            return res.status(400).send("Could not update user");
                        } else {
                            return res.status(200).send("User role updated");
                        }
                    });
                });
            } else {
                // this route cannot assign a new admin
                return res.status(400).send('An admin was already set');
            }
        });
    });

    /*
     *  Update user role - works like a toggle
     *  Admin rights needed
     */
    app.put(app.settings.apiRoute + '/user/admin/:username', function(req, res, next) {
        if (req.user.isAdmin) {
            // an extra check to make sure users can't demote themselves
            // done to avoid the use case where there are no more admins in the DB
            if (req.user.username == req.params.username) {
                return res.status(400).send("You can't demote yourself");
            }

            User.findOne({
                username: req.params.username
            }, function(err, user) {
                user.isAdmin = !user.isAdmin;
                user.save(function(er) {
                    if (er) {
                        return res.status(400).send("Could not update user");
                    } else {
                        return res.status(200).send("User role changed");
                    }
                });
            });
        } else {
            return res.status(401).send("You need to be an admin to perform this action");
        }
    });

    /*
     *  DELETE a single user - ADMIN
     */
    app.delete(app.settings.apiRoute + '/user/:id', function(req, res, next) {
        if (req.user.isAdmin) {
            // not allowing the users to delete themselves
            if (req.params.id == req.user._id) return res.status(400).send("Users not allowed to delete themselves");

            User.remove({
                _id: req.params.id
            }, function(err) {
                if (err) return res.status(400).send("User cannot be deleted");

                return res.status(200).send("User deleted");
            })
        } else {
            return res.status(401).send("Action not authorized");
        }
    });

    // HELPER FUNCTIONS

    function checkGetAdmin(req, res, next) {
        if (req.params.id && req.user._id == req.params.id) {
            return next();
        } else if (req.user.isAdmin) {
            return next();
        } else {
            return res.status(401).send("Action not permitted for your user role");
        }

    }

    function checkDeleteAdmin(req, res, next) {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(401).send("Action not authorized");
        }
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
                // temporary - app.post below
                User.collection.insert(req.body, function(error, user) {
                    console.log(user);
                    return res.status(200).send("User created");
                });
                // ----
                // next();
            });
        });
    }

    // Return middleware
    return function(req, res, next) {
        next();
    }
};