
'use strict'

angular.module('myApp.tasks', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/tasks', {
        templateUrl: 'tasks/tasks.html',
        controller: 'TasksCtrl'
    });

    $routeProvider.when('/task/:id',{
        templateUrl: 'tasks/task-detail.html',
        controller: 'TaskDetailsCtrl'
    });

}])

.controller('TasksCtrl', function($scope, $firebaseArray){
        
    var ref = firebase.database().ref().child('Tasks');
    $scope.data = $firebaseArray(ref);
})

.controller('TaskDetailsCtrl', function($scope, $firebaseArray, $routeParams){
    var id = $routeParams.id;
    var ref = firebase.database().ref().child('Tasks');
    var list = $firebaseArray(ref);
    var rec = list.$loaded().then(function(x){ 
        $scope.data = x.$getRecord(id);
    });
});
