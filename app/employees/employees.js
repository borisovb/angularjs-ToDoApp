'use strict'

angular.module('myApp.employees', ['ngRoute'])

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

.controller('EmployeesCtrl', function($scope, database){
    var empList = database.getCollection("Employees");
    var depList = database.getCollection("Departments");
    var projectsList = database.getCollection("Projects");
    var tasksList = database.getCollection("Tasks");
    
    $scope.employees = empList;
    $scope.departments = depList;
    $scope.projects = projectsList;
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
                                list[i].Employees.push({ Fake: true });
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

.controller('EmployeeDetailsCtrl', function($scope, database, $routeParams, $route){
    var empId = $routeParams.id;
    var empList = database.getCollection("Employees");
    
    empList.$loaded().then(function(x){ 
        $scope.employee = x.$getRecord(empId);
    })
})

.controller('EmployeeEditCtrl', function($scope, database, $routeParams, $route){
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

            currentRecord.Department.ID = $scope.selectedDepartment.$id;
            currentRecord.Department.Name = $scope.selectedDepartment.Name;
        }

        empList.$save(currentRecord).then(function(){
            $route.reload();
        });
    };

    
})



