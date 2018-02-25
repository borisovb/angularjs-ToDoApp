'use strict'

angular.module('myApp.projects', ['ngRoute', 'firebase'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/projects', {
        templateUrl: 'projects/projects.html',
        controller: 'ProjectsCtrl'
    });
}])

.controller('ProjectsCtrl', function($scope, $firebaseArray){
    var ref = firebase.database().ref().child('Projects');
    $scope.data = $firebaseArray(ref);
});