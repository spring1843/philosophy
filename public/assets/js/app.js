(function (angular) {
    'use strict';
    angular.module('philosophyApp', [])
        .controller('MainController', ['$scope', '$http', MainController]);

    function MainController($scope, $http) {
        $scope.path = [];
        $scope.url = "http://en.wikipedia.org/wiki/Food";
        $scope.searchInProgress = false;
        $scope.hops = null
        $scope.crawls = null
        $scope.error = null;

        $scope.getPath = function () {
            $scope.path = [];
            $scope.searchInProgress = true;
            $scope.hops = null;
            $scope.crawls = null;
            $scope.error = null;

            $http.get("/pathToPhilosophy?url=" + $scope.url)
                .success(function (response) {
                    $scope.searchInProgress = false;
                    $scope.path = response.path;
                    $scope.hops = response.hops;
                    $scope.crawls = response.crawls;
                    $scope.error = null;
                })
                .error(function (data, status, headers, config) {
                    $scope.searchInProgress = false;
                    $scope.error = 'Bad bad server!!!!. Please try again!';
                });
            ;
        }
    }
})(window.angular);

(function ($) {
    $.backstretch("http://upload.wikimedia.org/wikipedia/commons/1/1b/Greek_philosopher_busts.jpg");
})(window.$);

