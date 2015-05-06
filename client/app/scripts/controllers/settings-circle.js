'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SettingsCircleCtrl
 * @description
 * # SettingsCircleCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('SettingsCircleCtrl', function(
        $scope, FileUploader, AuthenticationService, User, $location, CONFIG, $window, $anchorScroll
    ) {
        if (AuthenticationService.isLogged) {
            $scope.scrollTo = function() {
                setTimeout(function() {
                    $location.hash("upload");
                    $anchorScroll();
                }, 500);
            };

            $scope.viewCircle = true;
            $scope.error = false;
            $scope.avatarChangeStatus = 0;
            $scope.host = CONFIG.API_HOST;
            $scope.user = {};
            var id = JSON.parse($window.sessionStorage.user).id;
            User.one(id).get().then(function(data, status, headers, config) {
                var profile = data;
                delete profile.password;
                $scope.user = profile;

                $scope.changeAvatar = function(newAvatar, requestType) {
                    $scope.user.newAvatar = newAvatar;
                    $scope.user.requestType = requestType;
                    User.one($scope.user.username).customPUT($scope.user, 'avatar').then(function(data) {
                        var user = JSON.parse($window.sessionStorage.user);

                        if (requestType == "change") {
                            user.avatar = newAvatar;
                            $window.sessionStorage.user = JSON.stringify(user);
                            $scope.avatarChangeStatus = 1;
                        } else if (requestType == "delete") {
                            if (user.avatar == newAvatar) {
                                user.avatar = '/uploads/default.png';
                                $window.sessionStorage.user = JSON.stringify(user);
                            }
                            // delete the image from the the scope so it dissapears from the view
                            var deletedIndex = $scope.user.uploads.indexOf(data);
                            $scope.user.uploads.splice(deletedIndex, 1);

                            $scope.avatarChangeStatus = 2;
                        }

                    }, function(response) {
                        $scope.avatarChangeStatus = 3;
                    });

                };
            });


            var url = CONFIG.API_HOST + "/user/" + JSON.parse($window.sessionStorage.user).username + "/avatar";
            var uploader = $scope.uploader = new FileUploader({
                url: url,
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

            /**
             * Show preview with cropping
             */
            uploader.onAfterAddingFile = function(item) {
            	$scope.avatarChangeStatus = 0;
                // $scope.croppedImage = '';
                $scope.scrollTo();
                item.croppedImage = '';
                var reader = new FileReader();
                reader.onload = function(event) {
                    $scope.$apply(function() {
                        item.image = event.target.result;
                    });
                };
                reader.readAsDataURL(item._file);
            };

            /**
             * Upload Blob (cropped image) instead of file.
             * @see
             *   https://developer.mozilla.org/en-US/docs/Web/API/FormData
             *   https://github.com/nervgh/angular-file-upload/issues/208
             */
            uploader.onBeforeUploadItem = function(item) {
                var blob = dataURItoBlob(item.croppedImage);
                item._file = blob;
            };

            /**
             * Converts data uri to Blob. Necessary for uploading.
             * @see
             *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
             * @param  {String} dataURI
             * @return {Blob}
             */
            var dataURItoBlob = function(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {
                    type: mimeString
                });
            };

            // CALLBACKS

            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                $scope.scrollTo();
                //console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onProgressItem = function(fileItem, progress) {
            	$scope.avatarChangeStatus = 0;
            	$scope.error = null;
                //console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                $scope.user.uploads.push(response);
                //console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                if (status === 403) {
                    $scope.error = response;
                }
                //console.info('onErrorItem', fileItem, response, status, headers);
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                //console.info('onCompleteItem', fileItem, response, status, headers);
            };
            uploader.onCompleteAll = function() {
                //console.info('onCompleteAll');
            };

            //console.info('uploader', uploader);
        } else {
            $location.path('/login');
        }
    });