'use strict'

angular.module('myApp.dashboard', ['ngRoute', 'myApp.data'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/', {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', function($scope, database){
    var tasks = database.getCollection('Tasks');
    tasks.$loaded().then(function(loadedTasks){
        loadedTasks.forEach(task => {
            task['CompletionDate'] = new Date(task['CompletionDate']);
        });
        loadedTasks.sort(function(a, b){
            return b['CompletionDate'] - a['CompletionDate'];
        });
        loadedTasks.splice(3);
        $scope.tasks = loadedTasks  ;
    });
});