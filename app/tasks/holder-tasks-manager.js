'use strict'

angular.module('myApp.tasks.holders', [])

.factory('holderManipulation', function(){

    function RemoveTaskFromHolder(taskID, holder, collection){
        var taskIndex = findIdIndex(holder.Tasks, taskID);
        if(taskIndex >= 0){
            holder.Tasks.splice(taskIndex, 1);

            if(holder.Tasks.length == 0){
                holder.Tasks.push({ "Fake" : true });
            }

            collection.$save(holder);
        }
    }

    function AddTaskToHolder(task, holder, collection){
        holder.Tasks.push(task);
        collection.$save(holder);
    }

    function findIdIndex(array, id){
        for (const key in array) {
            if (array.hasOwnProperty(key)) {
                if(array[key].ID == id){
                    return key;
                }
            }
        }
        return -1;
    }

    return {
        RemoveTaskFromHolder : RemoveTaskFromHolder,
        AddTaskToHolder : AddTaskToHolder
    }
});