'use strict'
angular.module('myApp.projects.holders', [])

.factory('projectHolderManipulation', function(){

    function addProjectToHolder(project, holder, collection){
        holder.Projects.push(project);
        collection.$save(holder);
    }

    function removeProjectFromHolder(projectID, holder, collection){
        var projectIndex = findIdIndex(holder.Projects, projectID);
        if(projectIndex >= 0){
            holder.Projects.splice(projectIndex, 1);

            if(holder.Projects.length == 0){
                holder.Projects.push({ "Fake" : true });
            }
            
            collection.$save(holder);
        }
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
        addProjectToHolder : addProjectToHolder,
        removeProjectFromHolder : removeProjectFromHolder
    }
});
