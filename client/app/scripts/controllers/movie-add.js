'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieAddCtrl
 * @description
 * # MovieAddCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MovieAddCtrl', function ($scope, Movie, $location) {
    $scope.movie = {};
    $scope.saveMovie = function(){
    	$scope.movie.url = $scope.movie.url.replace("watch?v=", "v/");
    	Movie.post($scope.movie).then(function() {
    		$location.path('/movies');
    	});
    };
  });
