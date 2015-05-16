'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SocialLinksCtrl
 * @description
 * # SocialLinksCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('SocialLinksCtrl', function($scope, $window, User, CONFIG, $location, $anchorScroll) {
        $scope.viewNetworks = true;
        $scope.isMaxNetworks = false;
        $scope.viewEdit = false;
        $scope.viewEditError = false;

        $scope.profile = {};
        $scope.selectedNetwork = {};

        var username = JSON.parse($window.sessionStorage.user).username;
        var id = JSON.parse($window.sessionStorage.user).id;
        User.one(username).get().then(function(data) {
            console.log(data);
            $scope.profile = data;
        }, function(response) {
            console.log(response);
        });

        $scope.beginEdit = function(position) {

            $scope.selectedNetwork = $scope.profile.social[position];
            console.log($scope.selectedNetwork);

            $scope.viewEdit = true;
            setTimeout(function() {
                var old = $location.hash();
                $location.hash('editNetwork');
                $anchorScroll();
                //reset to old to keep any additional routing logic from kicking in
                $location.hash(old);

            });
        };

        $scope.editNetwork = function() {
            $scope.profile.social[$scope.selectedNetwork.position] = $scope.selectedNetwork;
            console.log($scope.profile.social[$scope.selectedNetwork.position]);

            User.one(username).customPUT($scope.profile, 'network').then(function(data) {
                console.info(data);

                $scope.viewEdit = false;

                // scroll back to the top of the page
                setTimeout(function() {
                    var old = $location.hash();
                    $location.hash('manageNetworks');
                    $anchorScroll();
                    //reset to old to keep any additional routing logic from kicking in
                    $location.hash(old);

                });

            }, function(response) {
                console.error(response);
                $scope.viewEditError = true;
            });
        };

        $scope.addNetwork = function() {
            console.log($scope.profile.social);
            if (Object.keys($scope.profile.social).length >= CONFIG.MAX_NETWORKS) {
                $scope.isMaxNetworks = true;
            }
        };

    });