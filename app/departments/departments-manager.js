'use strict'

angular.module('myApp.departments.departmentsManager', ['myApp.data', 'myApp.departments.holders', 'myApp.activity'])

.factory('departmentsManager', ['database', 'departmentHolderManipulation', '$window', 'activityManager', 
    function(database, departmentHolderManipulation, $window, activityManager) {
    var departments;
    var employees;
    var projects;

    function getDepartments() {
        if(angular.isUndefined(departments)) {
            SaveLoadDepartments().then(function(deps) {
                departments = deps;
            })
        }
        
        return departments;
    }

    function getDepartmentById(id) {
        if(angular.isUndefined(departments)) {
            getDepartments();
        } else {
            return departments.$getRecord(id);
        }
    }

    function addDepartment(record) {
        record.Employees = [];
        record.Projects = [];

        record.Employees.push({Fake: true});
        record.Projects.push({Fake: true});

        departments.$add(record).then(function(department) {
                var depName = departments.$getRecord(department.key).Name;
                activityManager.NewActivity("create", "Department", depName);
                $window.alert('Successfully added "' + depName + '" to Departments!"');
            })
            .catch(function(error) {
                $window.alert('Could not add the department. ' + error);
            })
    }

    function removeDepartment(id) {
        var delDepartment = getDepartmentById(id);


        if((angular.isUndefined(delDepartment.Employees) && angular.isUndefined(delDepartment.Employees))
                || (delDepartment.Employees[0].Fake && delDepartment.Projects[0].Fake)) {
            departments.$remove(delDepartment)
                .then(function(department) {
                    activityManager.NewActivity("delete", "Department", delDepartment.Name);
                    $window.alert('Successfully removed "' + delDepartment.Name + '" from Departments!"');
                })
                .catch(function(error) {
                    $window.alert('Could not delete the department. ' + error);
                });
        } else {
            $window.alert("Please remove all employees and projects before deletion!");
        }   
    }

    function updateDepartment(name, depId) {
        var editDepartment = getDepartmentById(depId);
        var oldName = editDepartment.Name;
        editDepartment.Name = name;
        
        departments.$save(editDepartment)
        .then(function(department) {
            var editedDepartment = departments.$getRecord(department.key);
            var newName = editedDepartment.Name;
            
            employees = SaveLoadEmployees();
            projects = SaveLoadProjects();

            Promise.all([employees, projects]).then(function(collections) {
                for(var emp in editedDepartment.Employees) {
                    var holder = collections[0].$getRecord(editedDepartment.Employees[emp].ID);
                    console.log(holder);
                    var holderDepartment = {
                        ID: editedDepartment.$id,
                        Name: editedDepartment.Name
                    }
                    departmentHolderManipulation.addDepartmentToHolder(holderDepartment, holder, collections[0]);
                }
                for(var proj in editedDepartment.Projects) {
                    var holder = collections[1].$getRecord(editedDepartment.Projects[proj].ID);
                    var holderDepartment = {
                        ID: editedDepartment.$id,
                        Name: editedDepartment.Name
                    }
                    departmentHolderManipulation.addDepartmentToHolder(holderDepartment, holder, collections[1]);
                }
            })
            activityManager.NewActivity("update", "Department", newName);
            $window.alert('Successfully changed "' + oldName + '"' + ' to ' + '"' + newName + '"');
        }, function(error) {
            $window.alert('Could not rename department. ' + error);
        });
    }

    function SaveLoadDepartments(){
        if (departments === undefined) {
            departments = database.getCollection('Departments');
        }
        return departments.$loaded();
    }

    function SaveLoadProjects(){
        if (projects === undefined) {
            projects = database.getCollection('Projects').$loaded();
        }
        return projects;
    }

    function SaveLoadEmployees(){
        if  (employees === undefined){
            employees = database.getCollection('Employees').$loaded();
        }

        return employees;
    }

    return {
        addDepartment: addDepartment,
        getDepartments: getDepartments,
        updateDepartment: updateDepartment,
        removeDepartment: removeDepartment
    }
}])