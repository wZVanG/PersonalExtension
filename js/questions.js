var StackoverflowQuestions;

var app = angular.module("stackoverflow", []);

app.controller("Questions", ["$scope", "$timeout", function($scope, $timeout){

	$scope.questions = [];

	$scope.updateQuestions = function(questions){
		$scope.questions = questions;
	};

	$scope.queryQuestions = function(){
		chrome.runtime.sendMessage({type: "getBackgroundQuestions"}, function(response) {
			console.log("response",response);
			$scope.updateQuestions(response.questions);
			$timeout($scope.queryQuestions, 200);
		});
	};

	$scope.queryQuestions();
}]);
