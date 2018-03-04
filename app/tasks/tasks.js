
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
    var list = $firebaseArray(ref)
    $scope.data = list;

    var refProj = firebase.database().ref().child('Projects');
    $scope.projects = $firebaseArray(refProj);
    
    var refEmp = firebase.database().ref().child('Employees');
    $scope.employees = $firebaseArray(refEmp);

    $scope.DeleteRecord = function(key){
        var index = list.$indexFor(key);
        console.log(index);
        list.$remove(index);

        //TODO : UPDATE OTHER ENTITIES
    }
})

.controller('TaskDetailsCtrl', function($scope, $firebaseArray, $routeParams, $route){
    var id = $routeParams.id;
    var ref = firebase.database().ref().child('Tasks');
    var list = $firebaseArray(ref);
    var rec;
    list.$loaded().then(function(x){ 
        $scope.data = x.$getRecord(id);
        rec = $scope.data;
        
    });

    $scope.UpdateRecord = function(){
        list.$save(rec).then(function(){
            $route.reload()
        });

        //TODO : UPDATE OTHER ENTITIES
    };
});
