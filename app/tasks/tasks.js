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

.controller('TasksCtrl', function($scope, $firebaseArray, holderManipulation){
        
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
        var proj = projectsList.$getRecord($scope.record.Project.ID);
        var emp = empList.$getRecord($scope.record.Employee.ID);

        $scope.record.Project.Name = proj.Name;
        $scope.record.Employee.Name = emp.Name;

        taskList.$add($scope.record)
        .then(function(newRec){
            var shortTask = {"ID": newRec.key, "Name" : $scope.record.Title};

            holderManipulation.AddTaskToHolder(shortTask, proj, projectsList);
            holderManipulation.AddTaskToHolder(shortTask, emp, empList);
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

        holderManipulation.RemoveTaskFromHolder(recId, proj, projectsList);
        holderManipulation.RemoveTaskFromHolder(recId, emp, empList);
    }
})

.controller('TaskDetailsCtrl', function($scope, $firebaseArray, $routeParams, $route, holderManipulation){
    var id = $routeParams.id;
    var ref = firebase.database().ref().child('Tasks');
    var list = $firebaseArray(ref);
    var rec;

    var refProj = firebase.database().ref().child('Projects');
    var projectsList = $firebaseArray(refProj);
    $scope.projects = projectsList;
    
    var refEmp = firebase.database().ref().child('Employees');
    var empList = $firebaseArray(refEmp);
    $scope.employees = empList;

    list.$loaded().then(function(x){ 
        rec = x.$getRecord(id);
        
        projectsList.$loaded().then(function(){
            projectsList.forEach(function(item){
                if(rec.Project.ID == item.$id){
                    $scope.SelectedProject = item
                }
            })
        });
        empList.$loaded().then(function(){
            empList.forEach(function(item){
                if(rec.Employee.ID == item.$id){
                    $scope.SelectedEmployee = item
                }
            })
        });
        $scope.task = rec;
    });

    $scope.UpdateRecord = function(){
        
        //delete task from employee and project and save them 
        var proj = projectsList.$getRecord($scope.task.Project.ID);
        var emp = empList.$getRecord($scope.task.Employee.ID);

        holderManipulation.RemoveTaskFromHolder(rec.$id, proj, projectsList);
        holderManipulation.RemoveTaskFromHolder(rec.$id, emp, empList);

        //new data
        proj = projectsList.$getRecord($scope.SelectedProject.$id);
        emp = empList.$getRecord($scope.SelectedEmployee.$id);

        //update task
        rec.Employee = { "ID" : emp.$id, "Name" : emp.Name };
        rec.Project = { "ID" : proj.$id, "Name" : proj.Name };
        
        //add task to employee and project
        var shortTask = {"ID": rec.$id, "Name" : rec.Title};
        holderManipulation.AddTaskToHolder(shortTask, proj, projectsList);
        holderManipulation.AddTaskToHolder(shortTask, emp, empList);

        //save
        list.$save(rec).then(function(){
            $route.reload()
        });
    };
});