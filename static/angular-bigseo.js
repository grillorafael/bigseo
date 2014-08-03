angular.module('bigseo', [])
    .service('bigseo', ['$timeout', function($timeout) {
        var bigSeo = new BigSEO();

        this.save = function() {
            $timeout(function() {
                bigSeo.save();
            }, 200);
        };
    }])
