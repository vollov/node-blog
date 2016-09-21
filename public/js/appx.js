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
	})
	.state('posts', {
		url : 'posts',
		templateUrl : '/views/post/list.html',
		controller : 'PostCtrl',
		resolve: {
			postPromise: ['postService', function(postService){
				return postService.getAll();
			}]
		},
		data:{
			requireLogin: false
		}
	})
	.state('post-view', {
		url : '/post/view/:id',
		templateUrl : '/views/post/view.html',
		controller : 'PostViewCtrl',
		resolve : {
			post : ['$stateParams', 'postService',
			function($stateParams, postService) {
				return postService.get($stateParams.id);
			}]
		},
		data:{
			requireLogin: false
		}
	})
	.state('post-edit', {
		url : '/post/edit/:id',
		templateUrl : '/views/post/edit.html',
		controller : 'PostEditCtrl',
		resolve : {
			post : ['$stateParams', 'postService',
			function($stateParams, postService) {
				return postService.get($stateParams.id);
			}],
			postPromise: ['postService', function(postService){
				return postService.getTags();
			}]
		},
		data:{
			requireLogin: true
		}
	})
	.state('post-add', {
		url : '/post/add',
		templateUrl : '/views/post/edit.html',
		controller : 'PostAddCtrl',
		resolve: {
			postPromise: ['postService', function(postService){
				return postService.getTags();
			}]
		},
		data:{
			requireLogin: true
		}
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
