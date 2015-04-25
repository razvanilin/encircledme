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
        'restangular'
    ])
    .constant("CONFIG", {
        "API_HOST": "http://localhost:3000",
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
            .when('/movies', {
                templateUrl: 'views/movies.html',
                controller: 'MoviesCtrl'
            })
            .when('/create/movie', {
                templateUrl: 'views/movie-add.html',
                controller: 'MovieAddCtrl'
            })
            .when('/movie/:id', {
                templateUrl: 'views/movie-view.html',
                controller: 'MovieViewCtrl'
            })
            .when('/movie/:id/delete', {
                templateUrl: 'views/movie-delete.html',
                controller: 'MovieDeleteCtrl'
            })
            .when('/movie/:id/edit', {
                templateUrl: 'views/movie-edit.html',
                controller: 'MovieEditCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/:username', {
                templateUrl: 'views/user.html',
                controller: 'UserCtrl'
            })
            .when('/user/:username/edit', {
                templateUrl: 'views/user-edit.html',
                controller: 'UserEditCtrl'
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
            .otherwise({
                redirectTo: '/'
            });
    })
    .factory('MovieRestangular', function(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setRestangularFields({
                id: '_id'
            });
        });
    })
    .factory('Movie', function(MovieRestangular) {
        return MovieRestangular.service('movie');
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
    .factory('httpErrorResponseInterceptor', ['$q', '$location',
        function($q, $location) {
            return {
                response: function(responseData) {
                    return responseData;
                },
                responseError: function error(response) {
                    switch (response.status) {
                        case 401:
                            $location.path('/login');
                            break;
                        case 404:
                            $location.path('/404');
                            break;
                        default:
                            $location.path('/404');
                    }

                    return $q.reject(response);
                }
            };
        }
    ])
    .directive('youtube', function() {
        return {
            restrict: 'E',
            scope: {
                src: '='
            },
            templateUrl: 'views/youtube.html'
        };
    })
    .filter('trusted', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });