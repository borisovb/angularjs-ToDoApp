'use strict'

angular.module('myApp.weatherProvider', ['ngGeolocation'])

    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])

    .factory('weatherFactory', ['$http', '$geolocation', '$q',
        function ($http, $geolocation, $q) {
            var locationPromise;
            var weatherPromise;

            function getGeoLocationPromise() {
                if (angular.isUndefined(locationPromise)) {
                    var locationDefered = $q.defer();
                    $http.get('https://extreme-ip-lookup.com/json')
                        .then(function (response) {
                            var coordinates = response.data;
                            locationDefered.resolve(coordinates);
                        }, function (error) {
                            console.log("Error!");
                        })
                        locationPromise = locationDefered.promise;
                }


                return locationPromise;
            }

            function getWeatherPromise(coordinates) {
                if (angular.isUndefined(weatherPromise)) {
                    var weatherDefered = $q.defer();
                    var weatherData = {};
                    var apiKey = '6719378f816008e9df61a4ba4321afa2';

                    var lat = coordinates.lat;
                    var long = coordinates.lon;


                    $http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long +
                        '&units=metric&type=accurate&appid=' + apiKey)
                        .then(function (response) {
                            
                            weatherData.temperature = Math.round(response.data.main.temp);
                            weatherData.weatherIcon = 'http://openweathermap.org/img/w/' + response.data.weather[0].icon + '.png';
                            weatherData.location = response.data.name + ", " + response.data.sys.country;
                            weatherData.description = response.data.weather[0].main;
                            weatherDefered.resolve(weatherData);
                            
                        })
                        weatherPromise = weatherDefered.promise;
                }

                return weatherPromise;

            }

            function getWeather() {
                var deferred = $q.defer();
                var locPromise = getGeoLocationPromise();
                locPromise.then(function (coordinates) {
                    var weatherPromise = getWeatherPromise(coordinates);
                    weatherPromise.then(function (weather) {
                        deferred.resolve(weather);
                    })
                })
                return deferred.promise;
            }

            return {
                getWeather: getWeather
            }
        }])