'use strict'

angular.module('myApp.departments.departmentsManager', ['myApp.data', 'myApp.departments.holders'])

.factory('departmentsManager', ['database', 'departmentHolderManipulation', '$window', 
    function(database, holderManipulation, $window) {
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
                $window.alert('Successfully added "' + depName + '" to Departments!"');
            })
            .catch(function(error) {
                $window.alert('Could not add the department. Error: ' + error);
            })
    }

    function removeDepartment(id) {
        var delDepartment = getDepartmentById(id);


        if((angular.isUndefined(delDepartment.Employees) && angular.isUndefined(delDepartment.Employees))
                || (delDepartment.Employees[0].Fake && delDepartment.Projects[0].Fake)) {
            departments.$remove(delDepartment)
                .then(function(department) {
                    $window.alert('Successfully removed "' + delDepartment.Name + '" from Departments!"');
                })
                .catch(function(error) {
                    $window.alert('Could not delete the department. Error: ' + error);
                });
        } else {
            $window.aler("Please remove all employees and projects before deletion!");
        }   
    }

    function updateDepartment(name, depId) {
        var editDepartment = getDepartmentById(depId);
        var oldName = editDepartment.Name;
        editDepartment.Name = name;
        
        departments.$save(editDepartment)
        .then(function(department) {
            var newName = departments.$getRecord(department.key).Name;
            $window.alert('Successfully changed "' + oldName + '"' + ' to ' + '"' + newName + '"');
        })
        .catch(function(error) {
            $window.alert('Could not rename department. Error: ' + error);
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
            projects = database.getCollection('Projects');
        }
        return projects.$loaded();
    }

    function SaveLoadEmployees(){
        if  (employees === undefined){
            employees = database.getCollection('Employees');
        }

        return employees.$loaded();
    }

    return {
        addDepartment: addDepartment,
        getDepartments: getDepartments,
        updateDepartment: updateDepartment,
        removeDepartment: removeDepartment
    }
}])