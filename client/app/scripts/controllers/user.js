'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserCtrl', function ($scope, $routeParams, User, CONFIG, $window) {
    $scope.user = {};
    $scope.host = CONFIG.API_HOST;
    $scope.user.username = $routeParams.username;
    $scope.loading = true;
    User.one($routeParams.username).customGET('profile')
        .then(function(data) {
            $scope.loading = false;
            $scope.user = data;
            console.log($scope.user);
        });

    $scope.accessNetwork = function(network) {
        // check to see if the link is an email and apply 'mailto' to it
        if (validateEmail(network)) $window.location = 'mailto:'+network;
        
        else $window.open(network);
    };

    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
  });
