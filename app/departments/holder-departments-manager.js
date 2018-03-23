'use strict'

angular.module('myApp.departments.holders', [])

.factory('departmentHolderManipulation', function() {
    function removeDepartmentFromHolder(holder, collection) {
        if(!holder.Department.hasOwnProperty(Fake)) {
            holder.Department = {Fake: true};
            collection.$save(holder);
        }
    }

    function addDepartmentToHolder(department, holder, collection) {
            holder.Department = department;
            collection.$save(holder)
            .catch(function(error) {
                console.log('Holder update ' + error);
            })
    }

    return {
        removeDepartmentFromHolder : removeDepartmentFromHolder,
        addDepartmentToHolder : addDepartmentToHolder
    }
})