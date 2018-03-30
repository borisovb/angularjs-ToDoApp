'use strict'

angular.module('myApp.projects', ['ngRoute', 'myApp.projectsManager', 'myApp.data'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/projects', {
        templateUrl: 'projects/projects.html',
        controller: 'ProjectsCtrl'
    });

    $routeProvider.when('/project/:id/employees', {
        templateUrl: 'projects/project-employees.html',
        controller: 'ProjectEmployeesCtrl'
    });

    $routeProvider.when('/project/:id/tasks', {
        templateUrl: 'projects/project-tasks.html',
        controller: 'ProjectTasksCtrl'
    });

    $routeProvider.when('/project/:id', {
        templateUrl: 'projects/project-details.html',
        controller: 'ProjectDetailsCtrl'
    });
}])

.controller('ProjectsCtrl', function($scope, $filter, database, projects){
    $scope.data = projects.getProjects();
    $scope.departments = database.getCollection('Departments');

    $scope.AddRecord = function(){
        $scope.record.CreationDate = $filter('date')($scope.picker.CreationDate, "MM/dd/yyyy");
        $scope.record.CompletionDate = $filter('date')($scope.picker.CompletionDate, "MM/dd/yyyy");
        $scope.record.Department.Name = $scope.departments.$getRecord($scope.record.Department.ID)['Name'];
        projects.addRecord($scope.record);
    }

    $scope.DeleteRecord = function(recordID){
        projects.deleteRecord(recordID);
    }
})

.controller('ProjectDetailsCtrl', function($scope, $routeParams, $route, $filter, projects, database){
    var id = $routeParams.id;
    
    $scope.departments = database.getCollection('Departments');

    projects.getProjectById(id).then(function(project){
        $scope.project = project;
        
        $scope.departments.$loaded().then(function(deps){
            deps.forEach(dep => {
                if (dep.$id == project.Department.ID) {
                    $scope.SelectedDepartment = dep;
                }
            });
        });
    });

    $scope.UpdateRecord = function(){
        $scope.project.CreationDate = $filter('date')($scope.picker.CreationDate, "MM/dd/yyyy");
        $scope.project.CompletionDate = $filter('date')($scope.picker.CompletionDate, "MM/dd/yyyy");

        var oldDepartment = $scope.project.Department.ID;

        $scope.project.Department.ID = $scope.SelectedDepartment.$id;

        projects.updateProject($scope.project, oldDepartment);

        $route.reload()
    }
})

.controller('ProjectEmployeesCtrl', function($scope, $routeParams, $route, projects, database){
    var id = $routeParams.id;

    projects.getProjectById(id).then(function(project){
        $scope.project = project
        
        database.getCollection('Employees').$loaded().then(function(loadedEmployees){
            $scope.excludedEmployees =  loadedEmployees.filter(emp => NotInProject(project, emp.$id));
        });

    });

    $scope.AddEmployee = function(EmpId){
        projects.addEmployeeToProject($scope.project, EmpId);
        $route.reload();
    }

    $scope.RemoveEmployee = function(EmpId){
        projects.removeEmployeeFromProject($scope.project, EmpId);
        $route.reload();
    }

    function NotInProject(project, empID){
        return !project.Employees.some(emp => emp.ID == empID);
    }
})

.controller('ProjectTasksCtrl', function($scope, $routeParams, projects){
    var id = $routeParams.id;

    projects.getProjectById(id).then(function(project){
        $scope.project = project;
    })

});