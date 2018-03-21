'use strict'
angular.module('myApp.activity', ['myApp.data'])

.factory('activityManager', function(database){

    function NewActivity(operationType, typeName, name){
        var activity = database.getCollection('Activity');
        var currentDate = new Date().toLocaleString();
        var newActivty;

        if (operationType === "create"){
            newActivty = { "Type" : operationType, "Message": typeName + " " + name + " has been created", "DateTime": currentDate};
        }
        if (operationType === "update"){
            newActivty = { "Type" : operationType, "Message": typeName + " " + name + " has been updated", "DateTime": currentDate};
        }
        if (operationType === "delete"){
            newActivty = { "Type" : operationType, "Message": typeName + " " + name + " has been deleted", "DateTime": currentDate};
        }

        activity.push(newActivty, 1);
        activity.$add(newActivty);
    }

    return {
        NewActivity : NewActivity
    }
})