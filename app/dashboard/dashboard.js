'use strict'

angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', function($scope, database){
    var tasks = database.getCollection('Tasks');
    var employees = database.getCollection('Employees');
    var activity = database.getCollection('Activity');
    tasks.$loaded().then(function(loadedTasks){
        loadedTasks.forEach(task => {
            task['CompletionDate'] = new Date(task['CompletionDate']);
        });
        loadedTasks.sort(function(a, b){
            return b['CompletionDate'] - a['CompletionDate'];
        });
        loadedTasks.splice(3);
        $scope.tasks = loadedTasks;
    })

    employees.$loaded().then(function(loadedEmployees){

        for (let i = 0; i < loadedEmployees.length; i++) {

            if(loadedEmployees[i].Tasks.length > loadedEmployees[i+1].Tasks.length){
                $scope.mve = loadedEmployees[i];
            }
        }
    })
    

});