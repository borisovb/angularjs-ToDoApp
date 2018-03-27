'use strict'

angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather', 'mwl.calendar'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
    }])

    .controller('DashboardCtrl', function ($scope, database, moment, calendarConfig) {
        var tasks = database.getCollection('Tasks');
        var employees = database.getCollection('Employees');
        var activity = database.getCollection('Activity');
        $scope.activities = activity;
        $scope.activityLimit = 3;

        $scope.calendarView = 'month';
        $scope.viewDate = new Date();

        $scope.activityLoadMore = function activityLoadMore() {
            $scope.activityLimit = $scope.activityLimit + 3;
        }

        tasks.$loaded().then(function (loadedTasks) {
            loadedTasks.forEach(task => {
                task['CompletionDate'] = new Date(task['CompletionDate']);
            });
            loadedTasks.sort(function (a, b) {
                return b['CompletionDate'] - a['CompletionDate'];
            });
            loadedTasks.splice(3);
            $scope.tasks = loadedTasks;

            function generateColor() {
                var color = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + 
                (Math.floor(Math.random() * 256)) + ',' + 
                (Math.floor(Math.random() * 256)) + ', 0.6)';

                return color;
            }
            function getEvents() {
                var tasks = [];
                loadedTasks.forEach(task => {
                    var taskData = {};
                    var tempColor = generateColor();

                    taskData.title = task.Name;
                    taskData.startsAt = new Date(task.CreationDate);
                    taskData.endsAt = task.CompletionDate;
                    taskData.color = {
                        primary: tempColor,
                        secondary: tempColor
                    }

                    tasks.push(taskData);
                })

                return tasks;
            }
            var events = getEvents();

            
            $scope.events = events;
        })

        employees.$loaded().then(function (loadedEmployees) {

            for (let i = 0; i < loadedEmployees.length; i++) {

                if (loadedEmployees[i].Tasks.length > loadedEmployees[i + 1].Tasks.length) {
                    $scope.mve = loadedEmployees[i];
                }
            }
        })

    });