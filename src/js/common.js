(function () {

var app = angular
	.module('app', [])
	.controller('MainCtrl', ["$scope", "$http", function($scope, $http){

$scope.dataobj = {};
$http.defaults.headers.common['Authorization'] = "d7ceaa105ff77b29d59c8a3221820d6c1a6fd7d8";
var url = 'http://504080.com/api/v1/services/categories';
$http.get(url).success(function(data, status, headers, config) { 

	$scope.dataobj = data;

}).error(function(data, status, headers, config){

$scope.tokenMessage = data.error;

	if(status == "401" || "500"){

		errorInitiate();

		}

	});

	}]);



function MainCtrl ($scope, $http) {


}

var popup = document.querySelector(".popup"),
		overlay = document.querySelector(".overlay"),
		link = document.querySelector(".popup__close"),
		service = document.querySelector(".item__wrapper");

link.addEventListener("click", function(e){
		toggleMenus(e);
});

function errorInitiate(){

	popup.classList.remove("hidden");
	overlay	.classList.remove("hidden");
	service.style.display = 'none';
	
}

function toggleMenus(e){

	e.preventDefault();
	popup.classList.toggle("hidden");
	overlay.classList.toggle("hidden");
}



})();


