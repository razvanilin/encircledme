# Encircled Me #

A web app that allows users to create their own contact page with links to social media or other websites.

### The app is now live here: [encircled.me](http://encircled.me/) ##
* Give it a try 
* Keep in mind that this is not a stable version and most important of all - it's not secure
* Don't use passwords that you use for other accounts (e.g. online banking)
* Feel free to open issues or send pull requests

## Dev Environment Set-Up ##

### Dependencies ###
* Node.js and NPM

On Windows and OSX: https://nodejs.org/

```
sudo apt-get install nodejs
sudo apt-get install npm
```
or

```
sudo yum install nodejs
sudo yum install npm
```
* Install MongoDB v2.6 or below https://www.mongodb.org/downloads

```
sudo apt-get install mongodb-org
or
sudo yum install mongodb-org
```
* Install Grunt, bower and yeoman

```
sudo npm install -g grunt-cli
sudo npm install -g bower
sudo npm install -g yo
```
* Install compass gem
```
gem install compass
```
On Windows, install ruby from here http://rubyinstaller.org/ and then install the gem `gem install compass` from the command line

### Getting and setting up the project

* Clone the repository on your machine
```
git clone https://github.com/razvanilin/encircledme.git
```
* Navigate to the project folder and begin setup

```
cd encircledMe/
cd server/
npm install

cd ../client/
npm install
bower install
```
* Edit API port, db host and name, and the secret key used for generating tokens (server/settings.js)

```
module.exports = {
	dbhost: 'mongodb://your-ip/db-name',
	port: 3000,
	secret: 'place-your-key-here'
};
```
* Edit the IP address and port for the front-end application (client/Gruntfile.js)

```
connect: {
      options: {
        port: your-port,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'your-ip-address',
        livereload: 35729
      },
```
* Connect the Angular app to the server API (client/app/app.js)

```
.constant("CONFIG", {
        "API_HOST" : "your-api-host:port",
    })
```

# Starting the project #
* Create and start the database

```
mongod

mongo
use encircled
exit
```

* Start the API

```
cd server/
node index
```
* Start the Angular app

```
cd client/
grunt serve
```
