'use strict';

describe('Controller: SettingsCircleCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SettingsCircleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsCircleCtrl = $controller('SettingsCircleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
