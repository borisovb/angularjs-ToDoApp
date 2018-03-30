'use strict'

angular.module('myApp.dashboard', ['ngRoute', 'myApp.data', 'myApp.weather', 'mwl.calendar', 'ui.bootstrap', 
    'ngAnimate', 'myApp.sharedData'])

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

    .controller('DashboardCtrl', function ($scope, database, moment, calendarConfig, calendarEventTitle, 
        $location, previousUrl) {
        var tasksObj = database.getCollection('Tasks');
        var employees = database.getCollection('Employees');
        var activity = database.getCollection('Activity');
        $scope.activities = activity;
        $scope.activityLimit = 3;

        $scope.calendarView = 'month';
        $scope.viewDate = new Date();

        $scope.$on('$locationChangeStart', function (event, current, previous) {
            previousUrl.path = previous.replace('http://localhost:8000/', '');
            console.log(previousUrl.path);
        });

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

        

        employees.$loaded().then(function (loadedEmployees) {

            for (let i = 0; i < loadedEmployees.length; i++) {

                if (loadedEmployees[i].Tasks.length > loadedEmployees[i + 1].Tasks.length) {
                    $scope.mve = loadedEmployees[i];
                }
            }
        })

    });