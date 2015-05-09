'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SocialLinksCtrl
 * @description
 * # SocialLinksCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('SocialLinksCtrl', function($scope, $window, User){
    	$scope.profile = {};

    	var id = JSON.parse($window.sessionStorage.user).username;
    	User.one(id).get().then(function(data) {
    		console.log(data);
    		$scope.profile = data;
    	}, function(response) {	
    		console.log(response);
    	});
    });