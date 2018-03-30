'use strict'

angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather', 'mwl.calendar', 'ui.bootstrap', 
    'ngAnimate', 'myApp.sharedData', 'myApp.calendarProvider'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });

        $routeProvider.when('/task/:id', {
            templateUrl: 'tasks/task-detail.html',
            controller: 'TaskDetailsCtrl'
        })
    }])

    .controller('DashboardCtrl', function ($scope, database, moment,
        $location, previousUrl, calFactory) {
        var tasksObj = database.getCollection('Tasks');
        var employees = database.getCollection('Employees');
        var activity = database.getCollection('Activity');
        $scope.activities = activity;
        $scope.activityLimit = 3;

        $scope.calendarView = calFactory.calendarView;
        $scope.viewDate = calFactory.viewDate;
        $scope.events = [];

        tasksObj.$watch(function(event) {
            tasksObj.$loaded().then(function(loadedTasks) {
                $scope.events = calFactory.loadCal(loadedTasks);
            });
        });
        
        $scope.eventClicked = function(event) {
            var path = 'task/' + event.id;

            $location.url(path);
        }
        

        $scope.$on('$locationChangeStart', function (event, current, previous) {
            previousUrl.path = previous.replace('http://localhost:8000/', '');
            
        });

        

        $scope.activityLoadMore = function activityLoadMore() {
            $scope.activityLimit = $scope.activityLimit + 3;
        }

        tasksObj.$loaded().then(function (loadedTasks) {

            var tempTasks = [];
            loadedTasks.forEach(task => {
                task['CompletionDate'] = new Date(task['CompletionDate']);
                tempTasks.push(task);
            });
            tempTasks.sort(function (a, b) {
                return b['CompletionDate'] - a['CompletionDate'];
            });
            tempTasks.splice(3);
            $scope.tasks = tempTasks;
            
        })

        
        

        employees.$loaded().then(function (loadedEmployees) {
            var mostTasks = 0;
            for (let i = 0; i < loadedEmployees.length; i++) {
                if(loadedEmployees[i].Tasks.length >= mostTasks){
                    mostTasks = loadedEmployees[i].Tasks.length;
                    $scope.mve = loadedEmployees[i];
                }
            }
        })
        
    })
