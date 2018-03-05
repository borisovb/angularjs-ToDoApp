'use strict'

angular.module('myApp.departments', ['ngRoute', 'firebase', 'checklist-model'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/departments', {
        templateUrl: 'departments/departments.html',
        controller: 'DepartmentsCtrl'
    });

    $routeProvider.when('/departments/department-add', {
        templateUrl: 'departments/department-add.html',
        controller: 'AddDepartmentCtrl'
    });

    $routeProvider.when('/departments/department-details/:id', {
        templateUrl: 'departments/department-details.html/',
        controller: 'DepartmentDetailsCtrl'
    });
}])

.controller('DepartmentsCtrl', ['$scope', '$firebaseArray', 
    function($scope, $firebaseArray) {
        var ref = firebase.database().ref();
        $scope.data = $firebaseArray(ref.child('Departments'));
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        var empList = $firebaseArray(refEmp);
        var projList = $firebaseArray(refProj);

        $scope.delete = function(departmentId) {
            var depRec = $scope.data.$getRecord(departmentId);

            $scope.data.$remove($scope.data.$indexFor(departmentId))
            .then(function(newRec) {
                for(var employee in depRec.Employees) {
                    var empRec = empList.$getRecord(employee);
                    empRec.Department = {"Fake" : true };

                    empList.$save(empRec);
                }

                for(var proj in depRec.Projects) {
                    var projRec = projList.$getRecord(proj);
                    projRec.Department = { "Fake" : true };

                    projList.$save(projRec);
                }
            });
        } 
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

            var tempIndex = 0;
            for(var emp in $scope.record.Employees) {
                var empRec = $scope.employees.$getRecord(emp);
                var temp = {};
                temp.ID = empRec.$id;
                temp.Name = empRec.FirstName;
                empList[tempIndex++] = temp;
            }

            tempIndex = 0;
            for(var prj in $scope.record.Projects) {
                var projRec = $scope.projects.$getRecord(prj);
                var temp = {};
                temp.ID = projRec.$id;
                temp.Name = projRec.Name;
                projList[tempIndex++] = temp;
            }
            
            $scope.record.Employees = empList;
            $scope.record.Projects = projList;

            list.$add($scope.record)
            .then(function(newRec) {
                for(var emp in empList) {
                    var employeeRec = $scope.employees.$getRecord(emp);
                    
                    employeeRec.Department = {'ID': newRec.key, 'Name': $scope.record.Name};
                    $scope.employees.$save(employeeRec);
                }

                for(var prj in projList) {
                    var projRec = $scope.projects.$getRecord(prj);

                    projRec.Department = {'ID': newRec.key, 'Name': $scope.record.Name}
                    $scope.projects.$save(projRec);
                }
                $scope.record = {};
            });  
        };
}])

.controller('DepartmentDetailsCtrl', ['$scope', '$firebaseArray', '$routeParams', 
    function($scope, $firebaseArray, $routeParams) {
        var ref = firebase.database().ref();
        var depRef = ref.child('Departments');
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        var depList = $firebaseArray(depRef);
        var empList = $firebaseArray(refEmp);
        var projList = $firebaseArray(refProj);

        depList.$loaded().then(function(depList) {
            console.log($routeParams.id);
            console.log(depList[0]);
            $scope.department = depList.$getRecord($routeParams.id);
            console.log($scope.department.Name);
        })
        
        
}])