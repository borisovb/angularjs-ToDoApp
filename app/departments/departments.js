'use strict'

angular.module('myApp.departments', ['ngRoute', 'firebase', 'checklist-model'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/departments', {
        templateUrl: 'departments/departments.html',
        controller: 'DepartmentsCtrl'
    });

    $routeProvider.when('/departments/departments-add', {
        templateUrl: 'departments/department-add.html',
        controller: 'DepartmentsCtrl'
    });
}])

.controller('DepartmentsCtrl', ['$scope', '$firebaseArray', 
    function($scope, $firebaseArray) {
        var ref = firebase.database().ref().child('Departments');
        $scope.data = $firebaseArray(ref);
}])

.controller('AddDepartmentCtrl', ['$scope', '$firebaseArray', 
    function($scope, $firebaseArray) {
        var ref = firebase.database().ref();
        var list = $firebaseArray(ref.child('Departments'));
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        $scope.record = {};

        $scope.projects = $firebaseArray(refProj);
        $scope.employees = $firebaseArray(refEmp);

        $scope.add = function(record) {
            var empList = [{}];
            var projList = [{}];

            console.log($scope.record.Employees);

            for(var emp in $scope.record.Employees) {
                
                var empIndex = $scope.employees.$indexFor($scope.record.Employees[emp]);
                var temp = {};
                temp.ID = empIndex;
                temp.Name = $scope.employees[empIndex].FirstName;
                empList[empIndex] = temp;
            }

            for(var prj in $scope.record.Projects) {
                var projIndex = $scope.projects.$indexFor(prj);
                var temp = {};
                temp.ID = projIndex;
                temp.Name = $scope.projects[projIndex].Name;
                projList[projIndex] = temp;
            }
            
            $scope.record.Employees = empList;
            $scope.record.Projects = projList;
            list.$add($scope.record);
            $scope.record = {};
            //console.log($scope.record.emps);
            //console.log($scope.record.prjs);
        };


}]);