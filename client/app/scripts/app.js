'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * clientApp
 *
 * Main module of the application.
 */

//var settings = require('settings.js');

angular
    .module('clientApp', [
        'ngResource',
        'ngRoute',
        'restangular',
        'angularFileUpload',
        'ngImgCrop',
        'toggle-switch',
        'autofocus'
    ])
    .constant("CONFIG", {
        "API_HOST": "http://127.0.0.1:3000/apiv0",
        "API_UPLOADS": "/uploads",
        "MAX_NETWORKS": 9
    })
    .config(function($routeProvider, RestangularProvider, $httpProvider, $locationProvider, CONFIG) {

        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('httpErrorResponseInterceptor');
        //$locationProvider.html5Mode(true);

        RestangularProvider.setBaseUrl(CONFIG.API_HOST);

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/user-add.html',
                controller: 'UserAddCtrl'
            })
            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'LogoutCtrl'
            })
            .when('/404', {
                templateUrl: '404.html'
            })

            // keep username one of the last routes in the app to avoid faulty routing
            .when('/:username', {
                templateUrl: 'views/user.html',
                controller: 'UserCtrl'
            })
            .when('/user/:username/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl'
            })
            .when('/user/:username/account', {
                templateUrl: 'views/account.html',
                controller: 'AccountCtrl'
            })
            .when('/user/:username/picture', {
                templateUrl: 'views/picture-settings.html',
                controller: 'PictureSettingsCtrl'
            })
            .when('/user/:username/networks', {
                templateUrl: 'views/social-links.html',
                controller: 'SocialLinksCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .factory('LoginRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRestangularFields({
                id: '_id'
            });
        });
    })
    .factory('Login', function(LoginRestangular) {
        return LoginRestangular.service('login');
    })
    .factory('UserRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRestangularFields({
                id: '_id'
            });
        });
    })
    .factory('User', function(UserRestangular) {
        return UserRestangular.service('user');
    })
    .factory('AuthenticationService', function() {
        var auth = {
            isLogged: false
        }

        return auth;
    })
    .factory('LogoutService', function(AuthenticationService, $location, $window) {
        var logout = {
            logout: function() {
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.user;
                AuthenticationService.isLogged = false;
                $location.path('/login');
            }
        };

        return logout;
    })
    .factory('authInterceptor', function($rootScope, $q, $window, $location, AuthenticationService) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    AuthenticationService.isLogged = true;
                }
                return config;
            },
            response: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                    AuthenticationService.isLogged = false;
                }
                return response || $q.when(response);
            }
        };
    })
    .factory('httpErrorResponseInterceptor',
        function($q, $location, LogoutService) {
            return {
                response: function(responseData) {
                    return responseData;
                },
                responseError: function error(response) {
                    console.info(response.status);
                    switch (response.status) {
                        case 401:
                            LogoutService.logout();
                            break;
                        case 404:
                            $location.path('/404');
                            break;
                        default:
                            break;
                    }

                    return $q.reject(response);
                }
            };
    })
    .factory('ProfileService', function() {
        var profile = {
            profile: {}
        };

        return profile;
    })
    .directive('youtube', function() {
        return {
            restrict: 'E',
            scope: {
                src: '='
            },
            templateUrl: 'views/youtube.html'
        };
    })
    .directive('ngThumb', ['$window',
        function($window) {
            var helper = {
                support: !!($window.FileReader && $window.CanvasRenderingContext2D),
                isFile: function(item) {
                    return angular.isObject(item) && item instanceof $window.File;
                },
                isImage: function(file) {
                    var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            };

            return {
                restrict: 'A',
                template: '<canvas/>',
                link: function(scope, element, attributes) {
                    if (!helper.support) return;

                    var params = scope.$eval(attributes.ngThumb);

                    if (!helper.isFile(params.file)) return;
                    if (!helper.isImage(params.file)) return;

                    var canvas = element.find('canvas');
                    var reader = new FileReader();

                    reader.onload = onLoadFile;
                    reader.readAsDataURL(params.file);

                    function onLoadFile(event) {
                        var img = new Image();
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    }

                    function onLoadImage() {
                        var width = params.width || this.width / this.height * params.height;
                        var height = params.height || this.height / this.width * params.width;
                        canvas.attr({
                            width: width,
                            height: height
                        });
                        canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                    }
                }
            };
        }
    ])
    .filter('trusted', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });