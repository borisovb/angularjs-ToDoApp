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
            console.log(previousUrl.path);
        });
}])

/*.controller('AddDepartmentCtrl', ['$scope', '$firebaseArray', 
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
                var empRec = $scope.record.Employees[emp];
                var temp = {};
                temp.ID = empRec.$id;
                temp.Name = empRec.Name;
                empList[tempIndex++] = temp;
            }

            console.log(empList);
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
}]);*/

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
            console.log(previousUrl.path);
        });

        depList.$loaded().then(function(depList) {
            $scope.department = depList.$getRecord($routeParams.id);
            $scope.employees = $scope.department.Employees;
            $scope.projects = $scope.department.Projects;

            $scope.record.Name = $scope.department.Name;
            for(var i = 0; i < $scope.department.Employees.length; i++) {
                $scope.record.Employees[i] = $scope.department.Employees[i].ID;
            }
            
            for(var i = 0; i < $scope.department.Projects.length; i++) {
                $scope.record.Projects[i] = $scope.department.Projects[i].ID;
            }

            $scope.update = function(record) {
                var tempEmpList = [{}];
                var tempProjList = [{}];
                //console.log(record.Name);

                var tempIndex = 0;
               
                for(var emp in $scope.record.Employees) {
                    var empRec = $scope.employees.$getRecord(emp);
                    var temp = {};
                    temp.ID = empRec.$id;
                    temp.Name = empRec.Name;
                    tempEmpList[tempIndex++] = temp;
                }

                tempIndex = 0;
                for(var prj in $scope.record.Projects) {
                    var projRec = $scope.projects.$getRecord(prj);
                    var temp = {};
                    temp.ID = projRec.$id;
                    temp.Name = projRec.Name;
                    tempProjList[tempIndex++] = temp;
                }


                $scope.department.Name = record.Name;
                $scope.department.Employees = tempEmpList;
                $scope.department.Projects = tempProjList;
                console.log("Name: " +  $scope.department.Name);
                console.log("Employees: " + JSON.stringify($scope.department.Employees));
                console.log("Projects: " + JSON.stringify($scope.department.Projects));
                for(var emp in empList) {
                    console.log(emp);
                    console.log(empList.$getRecord(emp))
                }
            }
        })
        
        
}])