'use strict'

angular.module('myApp.weather', ['myApp.weatherProvider'])

    .controller('weatherCtrl', ['weatherFactory', '$scope',
        function (weatherFactory, $scope) {

            var currentWeather = weatherFactory.getWeather();

            currentWeather.then(function(weather) {
                $scope.temperature = weather.temperature
                $scope.weatherIcon = weather.weatherIcon;
                $scope.location = weather.location;
                $scope.description = weather.description;
            })

        }])

    .directive('weather', [function () {
        return {
            templateUrl: 'directives/weather-template.html',
            scope: {
                icon: '=icon',
                temperature: '=temperature',
                description: '=description',
                location: '=location'
            },
            restrict: 'E',
            replace: true,

        }
    }])
