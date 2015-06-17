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
        	$scope.networkLoad = true;
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
                    return '|jpg|png|jpeg|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function(item) {
            	$scope.logoLoading = true;
                console.info(item);
                item.upload();
            };

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
                $scope.logoError = "File format not supported. You can upload JPG/JPEG/PNG.";
            };

            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.selectedNetwork.logo = response;
                $scope.logoLoading = false;
                $scope.logoSuccess = true;
                $scope.logoError = false;
                uploader.queue.length = 0;
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                $scope.logoError = "Logo upload failed.";
                $scope.logoSuccess = false;
                $scope.logoLoading = false;
            };

            var username = JSON.parse($window.sessionStorage.user).username;
            var id = JSON.parse($window.sessionStorage.user).id;
            User.one(username).customGET('profile').then(function(data) {
            	$scope.networkLoad = false;
                console.log(data);
                $scope.profile = data;
            }, function(response) {
                console.log(response);
            });

            $scope.beginEdit = function(position) {
            	$scope.logoSuccess = false;
            	$scope.logoError = false;

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
            	$scope.loading = true;
                $scope.profile.social[$scope.selectedNetwork.position] = $scope.selectedNetwork;
                console.log($scope.profile.social[$scope.selectedNetwork.position]);

                User.one(username).customPUT($scope.profile, 'network').then(function(data) {
                    $scope.loading = false;
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