'use strict'
angular.module('myApp.data', ['firebase'])

.factory('database', function($firebaseArray){

    var collections = {};

    function getCollection(collectionName){
        var ref;

        if(collectionName == undefined){
            ref = firebase.database().ref();
            return $firebaseArray(ref);
        }else {    
            ref = firebase.database().ref().child(collectionName);
            collections[collectionName] = $firebaseArray(ref);
        }

        return collections[collectionName];
    }

    return {
        getCollection : getCollection
    }
})