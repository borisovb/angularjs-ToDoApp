'use strict'

angular.module('myApp.tasks', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/tasks', {
        templateUrl: 'tasks/tasks.html',
        controller: 'TasksCtrl'
    });

    $routeProvider.when('/task/:id',{
        templateUrl: 'tasks/task-detail.html',
        controller: 'TaskDetailsCtrl'
    });

}])

.controller('TasksCtrl', function($scope, $firebaseArray){
        
    var ref = firebase.database().ref().child('Tasks');
    var taskList = $firebaseArray(ref);
    $scope.data = taskList;

    var refProj = firebase.database().ref().child('Projects');
    var projectsList = $firebaseArray(refProj);
    $scope.projects = projectsList;
    
    var refEmp = firebase.database().ref().child('Employees');
    var empList = $firebaseArray(refEmp);
    $scope.employees = empList;

    $scope.AddRecord = function(){
        var projIndex = projectsList.$indexFor($scope.record.Project.ID);
        var empIndex = empList.$indexFor($scope.record.Employee.ID);

        var proj = $scope.projects[projIndex];
        var emp = $scope.employees[empIndex];

        $scope.record.Project.Name = proj.Name;
        $scope.record.Employee.Name = emp.FirstName;

        taskList.$add($scope.record)
        .then(function(newRec){
            proj.Tasks.push({"ID": newRec.key, "Name" : $scope.record.Title});
            emp.Tasks.push({"ID": newRec.key, "Name" : $scope.record.Title});

            projectsList.$save(proj);
            empList.$save(emp);
        });
    }

    $scope.DeleteRecord = function(recId){
        var task = taskList.$getRecord(recId);
        var projId = task.Project.ID;
        var empId = task.Employee.ID;

        var proj = projectsList.$getRecord(projId);
        var emp = empList.$getRecord(empId);

        var taskIndex = taskList.$indexFor(recId);
        taskList.$remove(taskIndex);

        var projectTaskIndex = findIndex(proj.Tasks, recId);
        if(projectTaskIndex >= 0){ 
            proj.Tasks.splice(projectTaskIndex, 1);

            if(proj.Tasks == []){
                proj.Tasks.push({ "Fake" : true });
            }

            projectsList.$save(proj);
        }

        var empTaskIndex = findIndex(emp.Tasks, recId)
        if(empTaskIndex >= 0){
            emp.Tasks.splice(empTaskIndex, 1);
            
            if(emp.Tasks == []){
                emp.Tasks.push({ "Fake" : true });
            }

            empList.$save(emp);
        }

        function findIndex(array, id){
            for (const key in array) {
                if (array.hasOwnProperty(key)) {
                    if(array[key].ID == id){
                        return key;
                    }
                }
            }
            return -1;
        }
    }
})

.controller('TaskDetailsCtrl', function($scope, $firebaseArray, $routeParams, $route){
    var id = $routeParams.id;
    var ref = firebase.database().ref().child('Tasks');
    var list = $firebaseArray(ref);
    var rec;
    list.$loaded().then(function(x){ 
        $scope.task = x.$getRecord(id);
        rec = $scope.task;
        
    });

    $scope.UpdateRecord = function(){
        list.$save(rec).then(function(){
            $route.reload()
        });

        //TODO : UPDATE OTHER ENTITIES
    };
});
