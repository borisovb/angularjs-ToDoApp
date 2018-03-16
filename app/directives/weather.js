'use strict'

angular.module('myApp.weather', ['ngGeolocation'])

    .controller('weatherCtrl', ['$scope', '$http', '$geolocation',
        function ($scope, $http, $geolocation) {
            $scope.weatherIcon = 'http://openweathermap.org/img/w/10d.png';
            $scope.temperature = 10;
            $scope.description = 'sunny';
            $scope.location = 'Eindhoven';

            $geolocation.getCurrentPosition( {
                enableHighAccuracy : true 
            })
                .then(function (position) {
                    var apiKey = '6719378f816008e9df61a4ba4321afa2';
                    console.log(position);
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    console.log(lat + ", " + long);

                    $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long +
                        '&units=metric&type=accurate&appid=' + apiKey)
                        .then(function (response) {
                            console.log(response);

                            $scope.temperature = Math.round(response.data.main.temp);
                            $scope.weatherIcon = 'http://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
                            $scope.location = response.data.name + ", " + response.data.sys.country;
                            $scope.description = response.data.weather[0].main;
                        }, function (error) {
                            console.log(error);
                        })
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

