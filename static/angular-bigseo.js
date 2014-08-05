angular.module('bigseo', [])
    .service('bigseo', ['$timeout', '$http', function($timeout, $http) {
        this.save = function(o) {
            if(!o) {
                o = {};
            }

            var opts = {
                url: o.url || '/save/cache',
                valid_url: o.valid_url || '/valid/cache'
            };

            $timeout(function() {
                $http.post(opts.valid_url, { url: document.URL }).
                    success(function (data, status, headers, config) {
                        if(!data.valid) {
                            $http.post(opts.url, {
                                url: document.URL,
                                dom: document.documentElement.innerHTML
                            }).
                            success(function (data, status, headers, config) {

                            }).
                            error(function (data, status, headers, config) {

                            });
                        }
                    }).
                    error(function (data, status, headers, config) {});
            }, 200);
        };
    }])
