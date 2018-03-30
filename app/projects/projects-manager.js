'use strict'
angular.module('myApp.projectsManager', ['myApp.data', 'myApp.activity', 'myApp.projects.holders', 'myApp.employees.holders', 'myApp.activity'])

.factory('projects', function(database, projectHolderManipulation, $window, employeesHolderManipulation, activityManager){

    var departments;
    var projects;
    var employees;

    function getProjects(){
        return database.getCollection('Projects');
    }

    function getProjectById(id){
        return SaveLoadProjects().then(function(loadedProjects){
            return loadedProjects.$getRecord(id);
        })
    }

    function addRecord(record){
        record.Employees = [{ 'Fake' : true }]
        record.Tasks = [{ 'Fake' : true }]

        getProjects().$add(record).then(function(newRec){
            var shortProject = { 'ID' : newRec.key, 'Name' : record.Name }
            SaveLoadDepartments().then(function(loadedDepartments){
                var dep = loadedDepartments.$getRecord(record.Department.ID);
                projectHolderManipulation.addProjectToHolder(shortProject, dep, loadedDepartments);
            });
            activityManager.NewActivity('create', 'Project', record.Name);
        });
    }

    function deleteRecord(recordID){
        var deps = SaveLoadDepartments();
        var emps = SaveLoadEmplyees();
        SaveLoadProjects().then(function(loadedProjects){
            var project = loadedProjects.$getRecord(recordID)

            if (!(project.Tasks.length == 1 && project.Tasks[0].hasOwnProperty("Fake"))) {
                $window.alert("Cant delete project with tasks, remove them first then try again!");
                return;
            }

            var employeesProject = emps.then(function(loadedEmployees){
                project.Employees.forEach(shortEmp => {
                    if(shortEmp.hasOwnProperty('ID')){
                        var emp = loadedEmployees.$getRecord(shortEmp.ID);
                        projectHolderManipulation.removeProjectFromHolder(recordID, emp, loadedEmployees);
                    }
                });
            });
            
            var departmentsPromise = deps.then(function(loadedDepartments){
                var dep = loadedDepartments.$getRecord(project.Department.ID);
                projectHolderManipulation.removeProjectFromHolder(recordID, dep, loadedDepartments);
            });

            Promise.all([employeesProject, departmentsPromise]).then(function(){
                activityManager.NewActivity('delete', 'Project', project.Name);
                loadedProjects.$remove(project);
            });
        });        
    }

    function updateProject(updatedRecord, oldDepartmentID){
        var shortProject = { "ID" : updatedRecord.$id, "Name" : updatedRecord.Name };

        SaveLoadDepartments().then(function(loadedDepartments){
            if(updatedRecord.Department.ID != oldDepartmentID){
                var oldDep = loadedDepartments.$getRecord(oldDepartmentID);
                projectHolderManipulation.removeProjectFromHolder(updatedRecord.$id, oldDep, loadedDepartments);

                var newDep = loadedDepartments.$getRecord(updatedRecord.Department.ID);
                updatedRecord.Department.Name = newDep.Name;
                projectHolderManipulation.addProjectToHolder(shortProject, newDep, loadedDepartments);
            }
        }).then(function(){
            SaveLoadProjects().then(function(loadedProjects){
                loadedProjects.$save(updatedRecord);
                activityManager.NewActivity('update', 'Project', updatedRecord.Name);
            });
        });
        
    }

    function addEmployeeToProject(project, employeeID){
        var shortProject = { "ID" : project.$id, "Name" : project.Name }

        SaveLoadEmplyees().then(function(loadedEmployees){
            var employee = loadedEmployees.$getRecord(employeeID);
            projectHolderManipulation.addProjectToHolder(shortProject, employee, loadedEmployees);
            return { "ID" : employee.$id, "Name" : employee.Name }
        }).then(function(shortEmployee){
            SaveLoadProjects().then(function(loadedProjects){
                project.Employees.push(shortEmployee);
                loadedProjects.$save(project);
            });
            activityManager.NewActivity('update', 'Project', project.Name);
        });

        
    }

    function removeEmployeeFromProject(project, employeeID){
        SaveLoadEmplyees().then(function(loadedEmployees){
            var employee = loadedEmployees.$getRecord(employeeID);
            projectHolderManipulation.removeProjectFromHolder(project.$id, employee, loadedEmployees);
        });

        SaveLoadProjects().then(function(loadedProjects){
            employeesHolderManipulation.RemoveEmployeeFromProjects(project.$id, employeeID, loadedProjects);
            activityManager.NewActivity('update', 'Project', project.Name);
        });
    }

    function SaveLoadProjects(){
        if (projects === undefined) {
            projects = database.getCollection("Projects");
        }
        return projects.$loaded();
    }

    function SaveLoadDepartments(){
        if  (departments === undefined){
            departments = database.getCollection("Departments");
        }

        return departments.$loaded();
    }

    function SaveLoadEmplyees(){
        if(employees === undefined){
            employees = database.getCollection("Employees");
        }

        return employees.$loaded();
    }


    return {
        getProjects : getProjects,
        getProjectById : getProjectById,
        addRecord : addRecord,
        deleteRecord : deleteRecord,
        updateProject : updateProject,
        addEmployeeToProject : addEmployeeToProject,
        removeEmployeeFromProject : removeEmployeeFromProject
    }
});