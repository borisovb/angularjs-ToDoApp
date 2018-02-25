
'use strict'

angular.module('myApp.tasks', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/tasks', {
        templateUrl: 'tasks/tasks.html',
        controller: 'TasksCtrl'
    });

}])

.controller('TasksCtrl', function($scope, $firebaseArray, $q){
        
    var ref = firebase.database().ref().child('Tasks');
    $scope.data = $firebaseArray(ref);
});


