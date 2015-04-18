# Encircled Me #

A web app that allows users to create their own contact page with links to social media. Sample: [razvanilin.com](http://razvanilin.com/)

## Dev Environment Set-Up ##

### Dependencies ###
* Node.js and NPM

```
#!bash

sudo apt-get install nodejs
sudo apt-get install npm
```
or

```
#!bash

sudo yum install nodejs
sudo yum install npm
```
* Install MongoDB v2.6 or below

```
#!bash

sudo apt-get install mongodb-org
or
sudo yum install mongodb-org
```
* Install Grunt, bower and yeoman

```
#!bash

sudo npm install -g grunt-cli
sudo npm install -g bower
sudo npm install -g yo
```
* Install compass gem
```
#!bash

gem install compass
```

### Getting and setting up the project

* Clone the repository on your machine
```
#!bash

git clone https://razvanilin@bitbucket.org/razvanilin/encircledme.git
```
* Navigate to the project folder and begin setup

```
#!bash

cd encircledMe/
cd server/
npm install

cd ../client/
npm install
bower install
```
* Edit API port, db host and name, and the secret key used for generating tokens (server/settings.js)

```
#!javascript

module.exports = {
	dbhost: 'mongodb://your-ip/db-name',
	port: 3000,
	secret: 'place-your-key-here'
};
```
* Edit the IP address and port for the front-end application (client/Gruntfile.js)

```
#!javascript

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
#!javascript

.constant("CONFIG", {
        "API_HOST" : "your-api-host:port",
    })
```

# Starting the project #
* Create and start the database

```
#!bash

mongod

mongo
use encircled
exit
```

* Start the API

```
#!bash

cd server/
node index
```
* Start the Angular app

```
#!bash

cd client/
grunt serve
```