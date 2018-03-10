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
        templateUrl: 'departments/department-details.html',
        controller: 'DepartmentDetailsCtrl'
    });
}])

.controller('DepartmentsCtrl', ['$scope', '$firebaseArray', 
    function($scope, $firebaseArray) {
        var ref = firebase.database().ref();
        var refDep = ref.child('Departments');
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        var empList = $firebaseArray(refEmp);
        var projList = $firebaseArray(refProj);
        var depList = $firebaseArray(refDep);

        $scope.data = depList;

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
        
        $scope.update = function(newName, depId) {
            var depRec = $scope.data.$getRecord(depId);

            if(!angular.isUndefined(newName)) {
                depRec.Name = newName;

                
                depList.$save(depRec).then(function(newRec) {
                    for(var emp in depRec.Employees) {
                        var empRec = empList.$getRecord(depRec.Employees[emp].ID);
                        empRec.Department.Name = newName;

                        empList.$save(empRec);
                    }
                    
                    for(var prj in depRec.Projects) {
                        var projRec = projList.$getRecord(depRec.Projects[prj].ID);
                        projRec.Department.Name = newName;

                        projList.$save(projRec);
                    }
                });
            }
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
                temp.Name = empRec.Name;
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
}]);

/*.controller('DepartmentDetailsCtrl', ['$scope', '$firebaseArray', '$routeParams', 
    function($scope, $firebaseArray, $routeParams) {
        var ref = firebase.database().ref();
        var depRef = ref.child('Departments');
        var refEmp = ref.child('Employees');
        var refProj = ref.child('Projects');

        var depList = $firebaseArray(depRef);
        var empList = $firebaseArray(refEmp);
        var projList = $firebaseArray(refProj);

        $scope.record = {
            Name: "",
            Employees: [],
            Projects: []
        }

        depList.$loaded().then(function(depList) {
            $scope.department = depList.$getRecord($routeParams.id);
            $scope.employees = empList;
            $scope.projects = projList;

            console.log($scope.department.Employees);

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
                /*depList.$save($scope.department).then(function(newRec) {
                    for(var emp in newRec.Employees) {
                        for(var ofAllEmp in empList) {
                            if(emp.)
                        }
                    }
                })
            }
        })
        
        
}])*/