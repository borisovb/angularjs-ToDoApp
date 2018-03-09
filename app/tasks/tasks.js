'use strict'

angular.module('myApp.tasks', ['ngRoute', 'firebase', 'myApp.tasksManager', 'myApp.data'])

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

.controller('TasksCtrl', function($scope, $firebaseArray, tasks, database){
       
    $scope.data = tasks.GetTasks();
    $scope.projects = database.getCollection("Projects");
    $scope.employees = database.getCollection("Employees");

    $scope.AddRecord = function(){
        tasks.AddTask($scope.record);
    }

    $scope.DeleteRecord = function(recId){
        tasks.DeleteTask(recId);
    }
})

.controller('TaskDetailsCtrl', function($scope, $firebaseArray, $routeParams, $route, tasks, database){
    var id = $routeParams.id;

    $scope.projects = database.getCollection("Projects");
    $scope.employees = database.getCollection("Employees");

    tasks.GetTaskById(id)
    .then(function(rec){
        $scope.task = rec
        $scope.projects.$loaded().then(function(){
            $scope.projects.forEach(function(item){
                if(rec.Project.ID == item.$id){
                    $scope.SelectedProject = item
                }
            })
        });
        $scope.employees.$loaded().then(function(){
            $scope.employees.forEach(function(item){
                if(rec.Employee.ID == item.$id){
                    $scope.SelectedEmployee = item
                }
            })
        });
    });

    $scope.UpdateRecord = function(){
        var oldProjectId = $scope.task.Project.ID;
        var oldEmployeeId = $scope.task.Employee.ID;

        $scope.task.Project.ID = $scope.SelectedProject.$id;
        $scope.task.Employee.ID = $scope.SelectedEmployee.$id;

        tasks.UpdateTask($scope.task, oldProjectId, oldEmployeeId);

        $route.reload()
    };
});