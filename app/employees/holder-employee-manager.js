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

    function RemoveEmployeeFromDepartments(departmentId, recordID, departmnentsList){
        for (let i = 0; i < departmnentsList.length; i++) {
            if (departmentId == departmnentsList[i].$id) {
               for (let j = 0; j < departmnentsList[i].Employees.length; j++) {
                   if (departmnentsList[i].Employees[j].ID == recordID){
                       if (departmnentsList[i].Employees.length == 1){
                            departmnentsList[i].Employees.push({"Fake": true});
                            departmnentsList.$save(departmnentsList[i]);
                       }
                        departmnentsList[i].Employees.splice(j, 1);
                        departmnentsList.$save(departmnentsList[i]);
                   }
                   
               }
            }
            
        }
    }

    function AddEmployeeToDepartment(shortEmployee, depId, departmentsList){
        
        for (let i = 0; i < departmentsList.length; i++) {
            if(departmentsList[i].$id == depId){
                departmentsList[i].Employees.push(shortEmployee);
                departmentsList.$save(departmentsList[i]);
            }
            
        }
    }



    return {
        RemoveEmployeeFromProjects : RemoveEmployeeFromProjects,
        RemoveEmployeeFromDepartments : RemoveEmployeeFromDepartments,
        AddEmployeeToDepartment  : AddEmployeeToDepartment,
    }
});