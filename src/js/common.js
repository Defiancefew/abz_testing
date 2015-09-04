(function () {

var app = angular
				.module('app', [])
				.controller('MainCtrl', MainCtrl);

// app.factory("auth", ["$resource", function($resource){

//  return $resource("http://504080.com/api/v1/services/categories");

// }]);

function MainCtrl ($scope, $http) {

$scope.dataobj = {};

// $http.defaults.headers.common['Authorization'] = "d7ceaa105ff77b29d59c8a3221820d6c1a6fd7d8";

var url = 'http://504080.com/api/v1/services/categories';

$http.get(url).success(function(data, status, headers, config) { 

	$scope.dataobj = data;

}).error(function(data, status, headers, config){

	var token = data.error;

	$scope.tokenMessage = token;


	// if(status == "401"){
	// 	$scope.message = "Unauthorized";
	// 	$scope.description = "Access token is missing or expired. Please login or signup to use our service";
	// 	$scope.code = "400";
	// }
	// else if(status == "500"){
	// 	$scope.message = "Server Error";
	// 	$scope.description = "Something happens on serverside. Please contact administrator or try again later";
	// 	$scope.code = "500";
	// }

	});
}

})();


