'use strict';

angular.module('message.controllers', [ 'message.services'])

.controller('MessageCtrl', ['$scope', 'messageService',
function($scope, messageService) {
	console.log('messages = %j', messageService.messages)
	$scope.messages = messageService.messages;

	$scope.saveMessage = function() {
		if (!$scope.name || $scope.name === '') {
			return;
		}
		messageService.create({
			name : $scope.name,
			email : $scope.email,
			phone : $scope.phone,
			ac:$scope.ac,
			furnance:$scope.furnance,
			other:$scope.other,
			content : $scope.content,
		});
		$scope.title = '';
		$scope.content = '';
	};
	
	$scope.selectMessage = function(row) {
		$scope.selectedRow = row;
	};
	
	$scope.deleteMessage = function(message, index) {
		console.log('delete message by id='+ message._id);
		messageService.deleteById(message._id);
		$scope.messages.splice(index, 1)
	};
	
	$scope.markProcessed = function(message) {
		console.log('mark message by id='+ message._id);
		message.processed = true;
		messageService.markProcessed(message);
		//$scope.messages.splice(index, 1)
	};
	
}])
.controller('MessageDetailCtrl', ['$scope', 'message', function($scope,message) {
	$scope.message = message;
}]);
