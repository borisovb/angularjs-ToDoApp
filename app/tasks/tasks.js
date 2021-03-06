'use strict'

angular.module('myApp.tasks', ['ngRoute', 'myApp.tasksManager', 'myApp.data', 'ngMaterial', 
    'ngMessages', 'myApp.sharedData'])

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

.controller('TasksCtrl', function($scope, $filter, tasks, database, $location, previousUrl){
    $scope.data = tasks.GetTasks();
    $scope.projects = database.getCollection("Projects");
    $scope.employees = database.getCollection("Employees");

    $scope.previousPath = previousUrl.path;

    $scope.AddRecord = function(){
        $scope.record.CreationDate = $filter('date')($scope.picker.CreationDate, "MM/dd/yyyy");
        $scope.record.CompletionDate = $filter('date')($scope.picker.CompletionDate, "MM/dd/yyyy");
        tasks.AddTask($scope.record);
    }

    $scope.DeleteRecord = function(recId){
        tasks.DeleteTask(recId);
    }

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        previousUrl.path = previous.replace('http://localhost:8000/', '');
        
    });
})

.controller('TaskDetailsCtrl', function($scope, $filter, $routeParams, $route, tasks, 
    database, $location, previousUrl){
    var id = $routeParams.id;

    $scope.previousPath = previousUrl.path;

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
        $scope.task.CreationDate = $filter('date')($scope.picker.CreationDate, "MM/dd/yyyy");
        $scope.task.CompletionDate = $filter('date')($scope.picker.CompletionDate, "MM/dd/yyyy");

        var oldProjectId = $scope.task.Project.ID;
        var oldEmployeeId = $scope.task.Employee.ID;

        $scope.task.Project.ID = $scope.SelectedProject.$id;
        $scope.task.Employee.ID = $scope.SelectedEmployee.$id;

        tasks.UpdateTask($scope.task, oldProjectId, oldEmployeeId);

        $route.reload()
    };

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        previousUrl.path = previous.replace('http://localhost:8000/', '');
        
    });
});