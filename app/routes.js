(function () {
	angular.module('MailzApp').config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/login'
			})
			.when('/inbox', {
				templateUrl: 'app/partials/inbox.html',
				controller: 'InboxCtrl'
			})
			.when('/login', {
				templateUrl: 'app/partials/login.html',
				controller: 'LoginCtrl'
			})
			.when('/signup', {
				templateUrl: 'app/partials/signup.html',
				controller: 'SignupCtrl'
			})
			.otherwise({ 
				redirectTo: '/'
			});
	});
})();