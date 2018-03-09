'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',  
  'myApp.tasks',
  'myApp.projects',
  'myApp.departments',
  'myApp.employees',
  'myApp.data',
  'firebase',
  'firebase'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/'});
}]);
