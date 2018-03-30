'use strict'

angular.module('myApp.departments', ['ngRoute', 'firebase', 'checklist-model', 
'myApp.data', 'myApp.departments.departmentsManager', 'myApp.sharedData'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/departments', {
        templateUrl: 'departments/departments.html',
        controller: 'DepartmentsCtrl'
    });

    $routeProvider.when('/departments/department-employees/:id', {
        templateUrl: 'departments/department-employees.html',
        controller: 'DepartmentDetailsCtrl'
    });

    $routeProvider.when('/departments/department-projects/:id', {
        templateUrl: 'departments/department-projects.html',
        controller: 'DepartmentDetailsCtrl'
    });
}])

.controller('DepartmentsCtrl', ['$scope', '$firebaseArray', 'departmentsManager', 'database', 
    '$location', 'previousUrl',

    function($scope, $firebaseArray, departmentsManager, database, $location, previousUrl) {
        var ref = firebase.database().ref();
        var refDep = ref.child('Departments');
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        $scope.previousPath = previousUrl.path;

        var empList = $firebaseArray(refEmp);
        var projList = $firebaseArray(refProj);
        var depList = $firebaseArray(refDep);

        $scope.data = departmentsManager.getDepartments();

        $scope.add = function(record) {
            departmentsManager.addDepartment(record);
            $scope.record.Name = "";
        }

        $scope.update = function(newName, depId) {
            departmentsManager.updateDepartment(newName, depId);
        }

        $scope.delete = function(id) {
            departmentsManager.removeDepartment(id);
        }

        $scope.$on('$locationChangeStart', function (event, current, previous) {
            previousUrl.path = previous.replace('http://localhost:8000/', '');
            
        });
}])

.controller('DepartmentDetailsCtrl', ['$scope', '$firebaseArray', '$routeParams', '$location', 'previousUrl',
    function($scope, $firebaseArray, $routeParams, $location, previousUrl) {
        var ref = firebase.database().ref();
        var depRef = ref.child('Departments');
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        $scope.previousPath = previousUrl.path;

        var depList = $firebaseArray(depRef);
        var empList = $firebaseArray(refEmp);
        var projList = $firebaseArray(refProj);

        $scope.record = {
            Name: "",
            Employees: [],
            Projects: []
        }

        $scope.$on('$locationChangeStart', function (event, current, previous) {
            previousUrl.path = previous.replace('http://localhost:8000/', '');
            
        });

        depList.$loaded().then(function(depList) {
            $scope.department = depList.$getRecord($routeParams.id);
            $scope.employees = $scope.department.Employees;
            $scope.projects = $scope.department.Projects;
        });
        
        
}])