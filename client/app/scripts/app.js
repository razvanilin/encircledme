'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * clientApp
 *
 * Main module of the application.
 */
angular
    .module('clientApp', [
        'ngResource',
        'ngRoute',
        'restangular'
    ])
    .config(function($routeProvider, RestangularProvider, $httpProvider, $locationProvider) {

        $httpProvider.interceptors.push('authInterceptor');
        //$locationProvider.html5Mode(true);

        RestangularProvider.setBaseUrl('http://188.226.229.203:3000');

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
            .when('/user/:username', {
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
    .factory('authInterceptor', function($rootScope, $q, $window, $location) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return response || $q.when(response);
            }
        };
    })
    .factory('LogOutService', function() {
        return {
            logOut: function() {console.log("yo");}
        };
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
    .filter('trusted', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });