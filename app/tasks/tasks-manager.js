'use strict'
angular.module('myApp.tasksManager', ['myApp.data', 'myApp.tasks.holders'])

.factory('tasks', function(database, taskHolderManipulation){

    var tasks;
    var projects;
    var employees;

    function GetTasks(){
        if (tasks === undefined) {
            tasks = database.getCollection("Tasks");
        }
        return tasks;
    }

    function GetTaskById(id){

        return SaveLoadTasks()
        .then(function(x) {
            return x.$getRecord(id);
        });
    }

    function AddTask(record){
        if(projects == undefined){
            projects = database.getCollection("Projects");
        }
        if(employees == undefined){
            employees = database.getCollection("Employees");
        }

        var project = projects.$loaded().then(function(list){
            var project = list.$getRecord(record.Project.ID);
            record.Project.Name = project.Name
            return project;
        });
        var employee = employees.$loaded().then(function(list){
            var employee = list.$getRecord(record.Employee.ID);
            record.Employee.Name = employee.Name;
            return employee;
        });
        
        Promise.all([project, employee]).then(function(values){
            tasks.$add(record).then(function(newRec){
                var shortTask = {"ID": newRec.key, "Name" : record.Name};
                taskHolderManipulation.AddTaskToHolder(shortTask, values[0], projects);
                taskHolderManipulation.AddTaskToHolder(shortTask, values[1], employees);
            });
        });
    }

    function DeleteTask(recordID){
        SaveLoadTasks().then(function(loadedTasks){
            var task  = loadedTasks.$getRecord(recordID);
            var projectsPromise =  SaveLoadProjects().then(function(loadedProjects){
                var project = loadedProjects.$getRecord(task.Project.ID);
                taskHolderManipulation.RemoveTaskFromHolder(recordID, project, loadedProjects);
            });
        
            var employeesPromise =  SaveLoadEmployees().then(function(loadedEmployees){
                var employee = loadedEmployees.$getRecord(task.Employee.ID);
                taskHolderManipulation.RemoveTaskFromHolder(recordID, employee, loadedEmployees);
            });

            Promise.all([projectsPromise, employeesPromise]).then(function(){
                loadedTasks.$remove(task);
            })
        })
    }

    function UpdateTask(updatedRecord, oldProjectID, oldEmployeeID){
        var shortTask = { "ID" : updatedRecord.$id, "Name" : updatedRecord.Name };

        var projectsPromise = SaveLoadProjects().then(function(loadedProjects){
            if (updatedRecord.Project.ID != oldProjectID) {
                var project = loadedProjects.$getRecord(oldProjectID);
                taskHolderManipulation.RemoveTaskFromHolder(updatedRecord.$id, project, loadedProjects)
    
                var newProject = loadedProjects.$getRecord(updatedRecord.Project.ID);
                updatedRecord.Project.Name = newProject.Name;
    
                taskHolderManipulation.AddTaskToHolder(shortTask, newProject, loadedProjects);
            } else {
                //Handle task name update in the holder
            }
        });

        var employeesPromise = SaveLoadEmployees().then(function(loadedEmployees){
            if (updatedRecord.Employee.ID != oldEmployeeID) {
                var employee = loadedEmployees.$getRecord(oldEmployeeID);
                taskHolderManipulation.RemoveTaskFromHolder(updatedRecord.$id, employee, loadedEmployees);
    
                var newEmployee = loadedEmployees.$getRecord(updatedRecord.Employee.ID);
                updatedRecord.Employee.Name = newEmployee.Name;
    
                taskHolderManipulation.AddTaskToHolder(shortTask, newEmployee, loadedEmployees);
            } else {
                //Handle task name update in the holder
            }
        });
        
        Promise.all([projectsPromise, employeesPromise]).then(function(){
            tasks.$save(updatedRecord);
        });
        
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

    function SaveLoadEmployees(){
        if  (employees === undefined){
            employees = database.getCollection("Employees");
        }

        return employees.$loaded();
    }

    return {
        GetTasks : GetTasks,
        GetTaskById : GetTaskById,
        AddTask : AddTask,
        DeleteTask : DeleteTask, 
        UpdateTask : UpdateTask
    }
})