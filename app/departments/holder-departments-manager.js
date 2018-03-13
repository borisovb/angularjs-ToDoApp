'use strict'

angular.module('myApp.departments.holders', [])

.factory('departmentHolderManipulation', function() {
    function removeDepartmentFromHolder(holder, collection) {
        if(!holder.Department.hasOwnProperty(Fake)) {
            holder.Department = {Fake: true};
        }
    }

    function addDepartmentToHolder(department, holder, collection) {
            holder.Department = department;
    }

    return {
        removeDepartmentFromHolder : removeDepartmentFromHolder,
        addDepartmentToHolder : addDepartmentToHolder
    }
})