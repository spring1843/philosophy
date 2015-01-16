(function(angular) {
    'use strict';
    angular.module('philosophyApp', [])
        .controller('MainController', ['$scope', '$http', MainController]);

    function MainController($scope, $http) {
        $scope.path = [];
        $scope.url ="http://en.wikipedia.org/wiki/Lifestyle";

        $scope.getPath = function() {
            $http.get("/pathToPhilosophy?url=" + $scope.url)
                .success(function (response) {
                    $scope.path = response.path;
                });
        }
    }
})(window.angular);

(function($) {
    $.backstretch("http://upload.wikimedia.org/wikipedia/commons/1/1b/Greek_philosopher_busts.jpg");
})(window.$);

