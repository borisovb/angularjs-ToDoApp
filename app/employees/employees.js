'use strict'

angular.module('myApp.employees', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/employees', {
        templateUrl: 'employees/employees.html',
        controller: 'EmployeesCtrl'
    });

}])

.controller('EmployeesCtrl', function($scope, $firebaseArray){
    var ref = firebase.database().ref().child('Employees');
    $scope.employees = $firebaseArray(ref);
});


