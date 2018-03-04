'use strict'

angular.module('myApp.employees', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/employees', {
        templateUrl: 'employees/employees.html',
        controller: 'EmployeesCtrl'
    });
    $routeProvider.when('/employee/:id',{
        templateUrl: 'employees/employee-detail.html',
        controller: 'EmployeeDetailsCtrl'
    });

}])

.controller('EmployeesCtrl', function($scope, $firebaseArray){
    var refEmp = firebase.database().ref().child('Employees');
    $scope.employees = $firebaseArray(refEmp);

    var refDep = firebase.database().ref().child('Departments');
    $scope.departments = $firebaseArray(refDep);
})

.controller('EmployeeDetailsCtrl', function($scope, $firebaseArray, $routeParams, $route){
    var empId = $routeParams.id;
    var ref = firebase.database().ref().child('Employees');
    var empList = $firebaseArray(ref);
    empList.$loaded().then(function(x){ 
        $scope.employee = x.$getRecord(empId);
        console.log($scope.employee);
        });
});


