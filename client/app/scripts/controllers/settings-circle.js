'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SettingsCircleCtrl
 * @description
 * # SettingsCircleCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('SettingsCircleCtrl', function($scope, FileUploader, AuthenticationService, User, $location, CONFIG, $window) {
        if (AuthenticationService.isLogged) {
            $scope.viewCircle = true;
            $scope.viewUploads = false;
            $scope.error = false;
            $scope.avatarChangeStatus = 0;
            $scope.host = CONFIG.API_HOST;
            $scope.user = {};
            var id = JSON.parse($window.sessionStorage.user).id;
            User.one(id).get().then(function(data, status, headers, config) {
                var profile = data;
                delete profile.password;
                $scope.user = profile;

                $scope.changeAvatar = function(newAvatar) {
                	$scope.user.newAvatar = newAvatar;
                    User.one($scope.user.username).customPUT($scope.user, 'avatar').then(function(data) {
                        $scope.avatarChangeStatus = 1;
                    }, function(response) {
                        $scope.avatarChangeStatus = 2;
                    });
                    
                }
            });


            var url = CONFIG.API_HOST + "/user/" + JSON.parse($window.sessionStorage.user).username + "/avatar";
            var uploader = $scope.uploader = new FileUploader({
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.token
                }
            });

            // FILTERS

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                $scope.viewUploads = true;
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                if (status === 403) {
                    $scope.error = response;
                }
                console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                console.info('onCompleteAll');
            };

            console.info('uploader', uploader);
        } else {
            $location.path('/login');
        }
    });