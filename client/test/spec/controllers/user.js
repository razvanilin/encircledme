'use strict';

describe('Controller: UserCtrl', function () {
  // load the controller's module
  beforeEach(module('clientApp'));

  var  UserCtrl, 
  $httpBackend,
  $scope,
  $routeParams,
  User;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$routeParams_, _User_) {
    $httpBackend = _$httpBackend_;
    $routeParams = _$routeParams_;
    User = _User_;
    
    $scope = $rootScope.$new();
    UserCtrl = $controller('UserCtrl', {
      $scope: $scope,
      $routeParams: $routeParams,
      User: User
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get the user profile', function () {
    $httpBackend.expectGET('http://localhost:3000/user').respond({
      avatar: 'raz.jpg',
      firstname: 'Razvan',
      lastname: 'Ilin'
    });

    //expect($scope.user.length).toBe(0);
    var user = User.query();
    $httpBackend.flush();

    expect(user.length).toBe(1);
  });
});
