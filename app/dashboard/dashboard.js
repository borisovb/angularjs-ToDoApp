'use strict'

angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather', 'ui.calendar'])

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
        $scope.tasks = loadedTasks;
        return loadedTasks;
    }).then(function(loadedTasks){
        var calendarEvents = [];
        loadedTasks.forEach(task => {
            calendarEvents.push({title : task.Name, start : new Date(task['CreationDate']), end : new Date(task['CompletionDate'])});
        });

        $('#calendar').fullCalendar({
            events: calendarEvents
        });
    });    
});