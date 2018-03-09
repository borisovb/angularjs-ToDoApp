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
    $routeProvider.when('/employees/add',{
        templateUrl: 'employees/employee-add.html',
        controller: 'EmployeeAddCtrl'
    });
    $routeProvider.when('/employees/edit/:id',{
        templateUrl: 'employees/employee-edit.html',
        controller: 'EmployeeEditCtrl'
    });

}])

.controller('EmployeesCtrl', function($scope, $firebaseArray){
    var refEmp = firebase.database().ref().child('Employees');
    var empList = $firebaseArray(refEmp);
    $scope.employees = empList;

    var refDep = firebase.database().ref().child('Departments');
    var depList = $firebaseArray(refDep);
    $scope.departments = depList;
    
    var refProjects = firebase.database().ref().child('Projects');
    var projectsList = $firebaseArray(refProjects);
    $scope.projects = projectsList;

    var refTasks = firebase.database().ref().child('Tasks');
    var tasksList = $firebaseArray(refTasks);
    $scope.tasks = tasksList;

    $scope.AddRecord = function AddEmployee (record){
        depList.forEach(dep => {
            if(dep.$id === record.Department){
                record.Department = {};
                var dep = { "ID" : dep.$id, "Name" : dep.Name};
                record.Department = dep;
            }
        });

        empList.$add(record);
        $scope.record = {};
        $scope.show = false;
        alert(record.Name + " is added successfully!");
    };

    $scope.DeleteRecord = function DeleteEmployee (recId){
        var employee = empList.$getRecord(recId);
        var answer = confirm("Do you really want to delete " + employee.Name + "?");
        if (answer) {
            // Remove employee from projects
            removeAtIndex(projectsList, recId, 'projects');
            // Remove employee from the task
            removeAtIndex(tasksList, recId, 'tasks');
            // Remove employee record from the database
            empList.$remove(employee);
        }
        

        function removeAtIndex(list, employeeId, type) {
            for (let i = 0; i < list.length; i++) {
                if (type === 'projects') {
                    for (let j = 0; j < list[i].Employees.length; j++) {
                        if(list[i].Employees[j].ID == employeeId) {
                            if(list[i].Employees.length === 1){
                                list[i].Employees.push({ "Fake" : true });
                                list.$save(list[i]);                                                            
                            }

                            list[i].Employees.splice(j, 1);
                            list.$save(list[i]);            
                        }
                    }
                } else {
                    if (list[i].Employee.ID == employeeId) {
                        list[i].Employee = { Fake: true };       
                        list.$save(list[i]);
                    }
                }
            }
        }
    }
    

})

.controller('EmployeeDetailsCtrl', function($scope, $firebaseArray, $routeParams, $route){
    var empId = $routeParams.id;
    var ref = firebase.database().ref().child('Employees');
    var empList = $firebaseArray(ref);
    
    empList.$loaded().then(function(x){ 
        $scope.employee = x.$getRecord(empId);
    })
})

.controller('EmployeeEditCtrl', function($scope, $firebaseArray, $routeParams, $route){
})



