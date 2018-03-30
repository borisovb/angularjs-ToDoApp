'use strict'

angular.module('myApp.calendarProvider', ['mwl.calendar', 'ui.bootstrap',
    'ngAnimate', 'myApp.data'])

    .factory('calFactory', ['calendarConfig', 'calendarEventTitle', 'database', '$q',
        function (calendarConfig, calendarEventTitle, database, $q) {
            var calendarView = 'month';
            var viewDate = new Date();
            var events;

            function loadCal(loadedTasks) {
                if (angular.isUndefined(events)) {
                    console.log("asdasd");
                    function generateColor(importance) {
                        var color = "";

                        switch (importance) {
                            case 'Low': color = calendarConfig.colorTypes.info; break;
                            case 'Medium': color = calendarConfig.colorTypes.success; break;
                            case 'High': color = calendarConfig.colorTypes.warning; break;
                            case 'Top priority': color = calendarConfig.colorTypes.important; break;
                        }

                        return color;
                    }

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
                    });
                    events = tasks;
                }

                return events;
            }


            return {
                calendarView: calendarView,
                viewDate: viewDate,
                loadCal: loadCal
            }
        }])