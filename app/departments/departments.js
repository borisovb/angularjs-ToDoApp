'use strict'

angular.module('myApp.departments', ['ngRoute', 'firebase'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/departments', {
        templateUrl: 'departments/departments.html',
        controller: 'DepartmentsCtrl'
    });
}])

.controller('DepartmentsCtrl', ['$scope', '$firebaseArray', 
    function($scope, $firebaseArray) {
        var ref = firebase.database().ref().child('Departments');
        $scope.data = $firebaseArray(ref);
}]);