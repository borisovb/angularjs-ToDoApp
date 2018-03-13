'use strict'

angular.module('myApp.employees.holders', [])

.factory('employeesHolderManipulation', function(database){

    function RemoveEmployeeFromProjects(projectIds, employeeId, projectsList){
        for (let i = 0; i < projectIds.length; i++) {
            for (let j = 0; j < projectsList.length; j++) {
                if(projectIds[i] == projectsList[j].$id){
                    for (let k = 0; k < projectsList[j].Employees.length; k++) {
                        if(projectsList[j].Employees[k].ID == employeeId){
                            if(projectsList[j].Employees.length == 1){
                                projectsList[j].Employees.push({"Fake": true});
                                projectsList.$save(projectsList[j]);
                            }                     
                                projectsList[j].Employees.splice(k, 1);
                                var record = projectsList[j];
                                projectsList.$save(record);
                        }
                    }
                }   
            }
        }
    }

    return {
        RemoveEmployeeFromProjects : RemoveEmployeeFromProjects,
    }
});