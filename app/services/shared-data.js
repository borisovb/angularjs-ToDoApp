'use strict'

angular.module('myApp.sharedData', [])

    .service('previousUrl', function() {
        var path = '#!/';

        return path;
    })