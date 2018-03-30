'use strict';

angular.module('myApp.employees', ['ngRoute', 'myApp.employeesManager', 
'myApp.employees.holders', 'myApp.activity', 
'ngMaterial', 'ngMessages', 'myApp.sharedData'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/employees', {
        templateUrl: 'employees/employees.html',
        controller: 'EmployeesCtrl'
    });
    $routeProvider.when('/employees/employee-projects/:id', {
        templateUrl: 'employees/employee-projects.html',
        controller: 'EmployeeDetailsCtrl'
    });
    $routeProvider.when('/employees/employee-tasks/:id', {
        templateUrl: 'employees/employee-tasks.html',
        controller: 'EmployeeDetailsCtrl'
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

.controller('EmployeesCtrl', function($scope, $filter, database, employeesManager, $location, previousUrl){
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

    $scope.previousPath = previousUrl.path;

    $scope.AddRecord = function(){
        $scope.record.DateOfBirth = $filter('date')($scope.picker.DateOfBirth, "MM/dd/yyyy");
        $scope.record.HireDate = $filter('date')($scope.picker.HireDate, "MM/dd/yyyy");
        employeesManager.AddEmployee($scope.record);
        $scope.record = {};
        $scope.show = false;
    };

    $scope.DeleteRecord = function(recId, recName){
            employeesManager.DeleteEmployee(recId)
    };

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        previousUrl.path = previous.replace('http://localhost:8000/', '');
        
    });
})

.controller('EmployeeDetailsCtrl', function($scope, database, $routeParams, $route, 
        employeesManager, $location, previousUrl){
    var empId = $routeParams.id;
    $scope.employee = employeesManager.GetEmployeeById(empId);

    $scope.previousPath = previousUrl.path;

    employeesManager.GetEmployeeById(empId).then(function(result){
        $scope.employee = result;
    })

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        previousUrl.path = previous.replace('http://localhost:8000/', '');
        
    });
})

.controller('EmployeeEditCtrl', function($scope, database, $routeParams, $route, employeesHolderManipulation, 
    activityManager, $location, $filter, previousUrl){
    var empId = $routeParams.id;

    var empList = database.getCollection("Employees");
    var depList = database.getCollection("Departments");
    
    $scope.departments = depList;

    $scope.previousPath = previousUrl.path;

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
            currentRecord.Department.ID = $scope.selectedDepartment.$id;
            currentRecord.Department.Name = $scope.selectedDepartment.Name;
        }
        currentRecord.DateOfBirth = $filter('date')($scope.picker.DateOfBirth, "dd/MM/yyyy");
        currentRecord.HireDate = $filter('date')($scope.picker.HireDate, "dd/MM/yyyy");
        
        empList.$save(currentRecord).then(function(newRec){
            var shortEmployee = { "ID" : newRec.key, "Name" : currentRecord.Name };
            employeesHolderManipulation.RemoveEmployeeFromDepartments(currentRecord.Department.ID, newRec.key, depList);
            employeesHolderManipulation.AddEmployeeToDepartment(shortEmployee, $scope.selectedDepartment.$id, depList);
            $route.reload();
        });
        alert('Employee updated!');
        activityManager.NewActivity("update", "Employee", currentRecord.Name);
    };

    $scope.$on('$locationChangeStart', function (event, current, previous) {
        previousUrl.path = previous.replace('http://localhost:8000/', '');
    });

})
