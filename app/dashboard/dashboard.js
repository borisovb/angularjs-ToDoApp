'use strict'

<<<<<<< HEAD
angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather', 'mwl.calendar', 'ui.bootstrap', 'ngAnimate'])
=======
angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather', 'mwl.calendar'])
>>>>>>> 5461146f3e00eb5b8354f289fb63597cb42999eb

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
<<<<<<< HEAD
        });

        $routeProvider.when('/task/:id', {
            templateUrl: 'tasks/task-detail.html',
            controller: 'TaskDetailsCtrl'
        })
    }])

    .controller('DashboardCtrl', function ($scope, database, moment, calendarConfig, calendarEventTitle, $location) {
        var tasksObj = database.getCollection('Tasks');
        var employees = database.getCollection('Employees');
        var activity = database.getCollection('Activity');
        $scope.activities = activity;
        $scope.activityLimit = 3;

        $scope.calendarView = 'month';
        $scope.viewDate = new Date();

        tasksObj.$watch(function(event) {
            loadCal(tasksObj);
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

            
            loadCal(loadedTasks);
            
            
        })

        
        console.log(calendarConfig);

        function loadCal(loadedTasks) {

            var events = getEvents(loadedTasks);

            $scope.events = events;

            
          

            $scope.eventClicked = function(event) {
                var path = 'task/' + event.id;

                $location.url(path);
            }

            function generateColor(importance) {
                var color = "";

                switch(importance) {
                    case 'Low': color = calendarConfig.colorTypes.info; break;
                    case 'Medium': color = calendarConfig.colorTypes.success; break;
                    case 'High': color = calendarConfig.colorTypes.warning; break;
                    case 'Top priority': color = calendarConfig.colorTypes.important; break;
                }

                return color;
            }
            
            function getEvents(loadedTasks) {
                var tasks = [];
                loadedTasks.forEach(task => {
                    var eventData = {};
                    var tempColor = generateColor(task.Importance);

                    eventData.title = task.Name;
                    eventData.startsAt = new Date(task.CreationDate);
                    eventData.endsAt = new Date(task.CompletionDate);
                    eventData.color = tempColor;
                    eventData.id = task.$id;

                    tasks.push(eventData);
                })

                return tasks;
            }
            
        }

        
=======
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
>>>>>>> 5461146f3e00eb5b8354f289fb63597cb42999eb

        employees.$loaded().then(function (loadedEmployees) {

            for (let i = 0; i < loadedEmployees.length; i++) {

                if (loadedEmployees[i].Tasks.length > loadedEmployees[i + 1].Tasks.length) {
                    $scope.mve = loadedEmployees[i];
                }
            }
        })

    });