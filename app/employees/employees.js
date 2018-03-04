'use strict'

angular.module('myApp.employees', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/employees', {
        templateUrl: 'employees/employees.html',
        controller: 'EmployeesCtrl'
    });

}])

.controller('EmployeesCtrl', function($scope, $firebaseArray){
    var refEmp = firebase.database().ref().child('Employees');
    $scope.employees = $firebaseArray(refEmp);

    var refDep = firebase.database().ref().child('Departments');
    $scope.departments = $firebaseArray(refDep);

    $scope.getProjects = function(empNo){
        var refEmp = firebase.database().ref().child('Employees');
        var list = $firebaseArray(refDep);
        list.$loaded().then(function(x){ 
            $scope.projects = x.$getRecord(empNo);
            return projectsList = $scope.projects;
        });
    };
});


