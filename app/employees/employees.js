'use strict';

angular.module('myApp.employees', ['ngRoute', 'myApp.employeesManager', 'myApp.employees.holders', 'myApp.activity'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/employees', {
        templateUrl: 'employees/employees.html',
        controller: 'EmployeesCtrl'
    });
    $routeProvider.when('/employee/:id',{
        templateUrl: 'employees/employee-detail.html',
        controller: 'EmployeeDetailsCtrl'
    });
    $routeProvider.when('/employees/edit/:id',{
        templateUrl: 'employees/employee-edit.html',
        controller: 'EmployeeEditCtrl'
    });

}])

.controller('EmployeesCtrl', function($scope, database, employeesManager){
    var empList = database.getCollection("Employees");
    var depList = database.getCollection("Departments");
    var projectsList = database.getCollection("Projects");
    var tasksList = database.getCollection("Tasks");
    var activity = database.getCollection('Activity');

    $scope.data = employeesManager.GetEmployees();
    $scope.departments = depList;
    $scope.projects = projectsList;
    $scope.tasks = tasksList;
    $scope.activity = activity;

    $scope.AddRecord = function(){
        employeesManager.AddEmployee($scope.record);
        $scope.record = {};
        $scope.show = false;
    };

    $scope.DeleteRecord = function(recId, recName){
            employeesManager.DeleteEmployee(recId)
    };
})

.controller('EmployeeDetailsCtrl', function($scope, database, $routeParams, $route){
    var empId = $routeParams.id;
    var empList = database.getCollection("Employees");

    empList.$loaded().then(function(x){
        $scope.employee = x.$getRecord(empId);
    })
})

.controller('EmployeeEditCtrl', function($scope, database, $routeParams, $route, employeesHolderManipulation, activityManager){
    var empId = $routeParams.id;

    var empList = database.getCollection("Employees");
    var depList = database.getCollection("Departments");

    $scope.departments = depList;

    var currentRecord;

    empList.$loaded().then(function(x){
        $scope.selectedEmployee = x.$getRecord(empId);
        currentRecord = $scope.selectedEmployee;
    })

    $scope.departments.$loaded().then(function(){
        $scope.departments.forEach(function(item){
            if(currentRecord.Department.ID == item.$id){
                $scope.selectedDepartment = item
            }
        })
    });

    $scope.UpdateRecord = function UpdateRecord (){

        if (currentRecord.Department.ID != $scope.selectedDepartment.$id) {
            employeesHolderManipulation.RemoveEmployeeFromDepartments(currentRecord.Department.ID, currentRecord.$id, depList);
            currentRecord.Department.ID = $scope.selectedDepartment.$id;
            currentRecord.Department.Name = $scope.selectedDepartment.Name;
        }
        empList.$save(currentRecord).then(function(newRec){
            var shortEmployee = { "ID" : newRec.key, "Name" : currentRecord.Name };
            employeesHolderManipulation.AddEmployeeToDepartment(shortEmployee, $scope.selectedDepartment.$id, depList);
            $route.reload();
            alert('Employee updated!');
        });
        activityManager.NewActivity("update", "Employee", currentRecord.Name);
    };


})
