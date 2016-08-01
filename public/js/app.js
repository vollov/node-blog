'use strict';

//{headers: {Authorization: 'Bearer '+authService.getToken()}}

angular.module('blogApp', ['ui.router', 'auth'])
.constant('API', '/api/v1.0/')
.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	$stateProvider.state('home', {
		url : '/home',
		templateUrl : '/views/home.html',
		data:{
			requireLogin: false
		}
		//controller : 'MainCtrl'
	}).state('register', {
		url : '/register',
		templateUrl : '/views/register.html',
		controller : 'AuthCtrl',
		data:{
			requireLogin: false
		},
		onEnter : [ '$state', 'authService', function($state, authService) {
			if (authService.isLoggedIn()) {
				$state.go('home');
			}
		}]
	});
	
	$httpProvider.interceptors.push('authInterceptor');
	
	$urlRouterProvider.otherwise('home');
}])
.filter('yesNo', function() {
    return function(input) {
        return input ? 'yes' : 'no';
    }
})
.run(function ($rootScope,$state,authService) {

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
		var requireLogin = toState.data.requireLogin;
		console.log('state change event, isLoggedIn=%s',authService.isLoggedIn());
		// typeof $rootScope.currentUser === 'undefined'
		if (requireLogin && (!authService.isLoggedIn())) {
			event.preventDefault();
			// code for unauthorized access
			console.log('state change event -- unauthorized');
			$state.go('home');
		}
	});
});
