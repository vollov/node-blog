'use strict';

var url = '/api/v1.0/';

angular.module('message.services', ['auth.services'])
.factory('messageService', [ '$http', 'authService', function($http, authService) {
	
	var service = {
			messages : []
	};
	//
	service.getAll = function() {
		return $http.get(url + 'messages')
		.success(function(data) {
			angular.copy(data, service.messages);
		});
	};
	
	service.create = function(message) {
		return $http.post(url + 'messages', message).success(function(data){
			service.messages.push(data);
		});
	};
	
	service.get = function(id) {
		return $http.get(url + 'messages/' + id).then(function(res) {
			return res.data;
		});
	};
	
	service.deleteById = function(id) {
		return $http.delete(url + 'messages/' + id).then(function(res) {
			return res.data;
		});
	};
	
	service.markProcessed = function(message) {
		return $http.put(url + 'messages/' + message._id, message).then(function(res) {
			return res.data;
		});
	};
	
	return service;
} ]);