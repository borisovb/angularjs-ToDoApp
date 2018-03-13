'use strict'
angular.module('myApp.employeesManager', ['myApp.data', 'myApp.employees.holders'])

.factory('employeesManager', function(database, employeesHolderManipulation){

    var tasks;
    var projects;
    var employees;
    var departments;

    function GetEmployees(){
        if (employees === undefined) {
            employees = database.getCollection("Employees");
        }
        return employees;
    }

    function GetEmployeeById(id){

        return SaveLoadEmployees()
        .then(function(x) {
            return x.$getRecord(id);
        });
    }

    function AddEmployee(record){

        if(departments == undefined){
            departments = database.getCollection("Departments");
        }

        departments.$loaded().then(function(list){
            var department = list.$getRecord(record.Department.ID);
            record.Department.Name = department.Name;
            return department;
        })
        .then(function(){
            record.Tasks = [{"Fake": true}];
            record.Projects = [{"Fake": true}];
            employees.$add(record).then(function(newRec){
                alert(record.Name + " is added successfully!");
            }); 
        });
    }

    function DeleteEmployee(recordID) {

        SaveLoadEmployees().then(function(loadedEmployees){
            var employee  = loadedEmployees.$getRecord(recordID);
            var projectIds = [];
            var answer = confirm("Do you really want to delete " + employee.Name + "?");
            if (answer) {
                if(employee.Tasks.length == 1 && employee.Tasks[0]['Fake'] == true){
                    for (let i = 0; i < employee.Projects.length; i++) {
                        if(employee.Projects[i].hasOwnProperty('ID')){
                            projectIds.push(employee.Projects[i].ID);
                        }
                    }
                    SaveLoadProjects().then(function(loadedProjects){
                        employeesHolderManipulation.RemoveEmployeeFromProjects(projectIds, recordID, loadedProjects);
                    })
                    loadedEmployees.$remove(employee);
                } else {
                    alert("You can not delete employee with assigned task/s.")
                }
            }
        })
    }

    function UpdateEmployeeDepartment(currentRecord, selectedDepartment){
        if (currentRecord.Department.ID != selectedDepartment.$id) {
            currentRecord.Department.ID = selectedDepartment.$id;
            currentRecord.Department.Name = selectedDepartment.Name;
        }
    }

    function SaveLoadEmployees(){
        if  (employees === undefined){
            employees = database.getCollection("Employees");
        }

        return employees.$loaded();
    }

    function SaveLoadTasks(){
        if (tasks === undefined) {
            tasks = database.getCollection("Tasks");
        }
        return tasks.$loaded();
    }

    function SaveLoadProjects(){
        if (projects === undefined) {
            projects = database.getCollection("Projects");
        }
        return projects.$loaded();
    }

    function SaveLoadDepartments(){
        if (departmnets === undefined) {
            departments = database.getCollection("Departments");
        }
        return departments.$loaded();
    }

    

    return {
        GetEmployees : GetEmployees,
        GetEmployeeById : GetEmployeeById,
        AddEmployee : AddEmployee,
        DeleteEmployee : DeleteEmployee, 
        UpdateEmployeeDepartment : UpdateEmployeeDepartment
    }
})