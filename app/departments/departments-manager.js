'use strict'

angular.module('myApp.departments.departmentsManager', ['myApp.data', 'myApp.departments.holders'])

.factory('departmentsManager', ['database', 'holderManipulation', '$window', 
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
        return SaveLoadDepartments().then(function(x) {
            return x.$getRecod(id);
        });
    }

    function addDepartment(record) {
        departments.$add(record).then(function(department) {
                var depName = departments.$getRecord(department.key).Name;
                $window.alert('Successfully added "' + depName + '" to Departments!"');
            })
            .catch(function(error) {
                $window.alert('Could not add the department. Error: ' + error);
            })
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
        addDepartment : addDepartment,
        getDepartments: getDepartments
    }
}])