'use strict';

var url = '/api/v1.0/';

angular.module('auth.services', [])
.factory('authService', [ '$http', '$window', function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['beryl-client-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['beryl-client-token'];
	};
	
	auth.isLoggedIn = function() {
		var token = auth.getToken();
		//console.log('in auth.isLoggedIn token=' + token);
		if (token && token != 'undefined') {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;
		}
	};
	
	auth.register = function(user) {
		return $http.post(url + '/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post(url + '/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('beryl-client-token');
	};
	return auth;
} ])
.factory('authInterceptor', ['$injector','API',function authInterceptor($injector,API) {
	var interceptor = {};
	
	
	interceptor.request = function(config) {
		console.log('testInterceptor request config.url=%s', config.url);
		
		var authService = $injector.get('authService');
		var token = authService.getToken();
		
		console.log('testInterceptor request config.url.indexOf(API)=%s, token=%s', config.url.indexOf(API), token);
		if (config.url.indexOf(API) === 0 && token) {
			console.log('testInterceptor request --send token = ' + token);
			config.headers.Authorization = 'Bearer ' + token;
		}
		return config;
	};
	
	interceptor.response = function(res) {
		console.log('testInterceptor response res.config.url=%s', res.config.url);
		console.log('testInterceptor response: res.config.url.indexOf(API)=%s, res.data.token=%s ',res.config.url.indexOf(API),res.data.token);
		//authService.saveToken('aabbcc');
		var authService = $injector.get('authService');
		if(res.config.url.indexOf(API) === 0 && res.data.token) {
		      console.log('here');
		      authService.saveToken(res.data.token);
		      }
		return res;
	};
	
	interceptor.responseError= function(res) {
		console.log('testInterceptor responseError');
		return res;
	};
	return interceptor;	
}]);