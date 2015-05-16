'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SocialLinksCtrl
 * @description
 * # SocialLinksCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('SocialLinksCtrl', function(
        $scope,
        $window,
        User,
        CONFIG,
        $location,
        $anchorScroll,
        AuthenticationService,
        FileUploader) {

        if (AuthenticationService.isLogged) {
            $scope.viewNetworks = true;
            $scope.isMaxNetworks = false;
            $scope.viewEdit = false;
            $scope.viewEditError = false;

            $scope.profile = {};
            $scope.selectedNetwork = {};
            $scope.host = CONFIG.API_HOST;

            var uploader = $scope.uploader = new FileUploader({
                url: '',
                headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.token
                },
                queueLimit: 1
            });

            // FILTERS

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function(item) {
                console.info(item);
                item.upload();
            };

            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.selectedNetwork.logo = response;
                uploader.queue.length = 0;
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };

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

                // LOGO UPLOADS

                var url = CONFIG.API_HOST + "/user/" + JSON.parse($window.sessionStorage.user).username + "/network/" + position;
                uploader.url = url;
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

            $scope.changeStatus = function() {
                User.one(username).customPUT($scope.profile, 'network').then(function(data) {
                    console.info(data);

                }, function(response) {
                    console.error(response);
                });
            };


        } else {
            $location.path('login');
        }

    });