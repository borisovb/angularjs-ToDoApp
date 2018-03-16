'use strict';
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

        var depId;
        var departmentsList;

        SaveLoadDepartments().then(function(list){
            departmentsList = list;
            depId = record.Department.ID;


            var department = departmentsList.$getRecord(depId);
            record.Department.Name = department.Name;

            record.Tasks = {"Fake": true};
            record.Projects = {"Fake": true};

            employees.$add(record).then(function(newRec){
                var shortEmployee = { "ID" : newRec.key, "Name" : record.Name };
                employeesHolderManipulation.AddEmployeeToDepartment(shortEmployee, depId, departmentsList);
                alert(record.Name + " is added successfully!");
            });
        });

    }

    function DeleteEmployee(recordID) {

        SaveLoadEmployees().then(function(loadedEmployees){
            var employee  = loadedEmployees.$getRecord(recordID);
            var departmentId = employee.Department.ID;
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
                    SaveLoadDepartments().then(function(loadedDepartments){
                        employeesHolderManipulation.RemoveEmployeeFromDepartments(departmentId, recordID, loadedDepartments);
                    })
                    loadedEmployees.$remove(employee);
                } else {
                    alert("You can not delete employee with assigned task/s.")
                }
            }
        })
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
        if (departments === undefined) {
            departments = database.getCollection("Departments");
        }
        return departments.$loaded();
    }



    return {
        GetEmployees : GetEmployees,
        GetEmployeeById : GetEmployeeById,
        AddEmployee : AddEmployee,
        DeleteEmployee : DeleteEmployee,
    }
})
