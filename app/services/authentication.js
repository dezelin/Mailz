/* global CryptoJS */
(function () {
	'use strict'
	
	angular.module('MailzApp')
		.service('authenticationService', ['$log', '$q', 'objectStoreService', 'cryptoService',
			function($log, $q, objectStoreService, cryptoService) {
				var self = this;

				self.LOGIN_FAILED = -1;
				self.SIGNUP_FAILED = -2;
				
				// Login user
				self.login = function (user) {
					var p = $q.defer();
					objectStoreService.findUserByEmail(user.email).then(function (foundUser) {
						var hash = cryptoService.hash(user.password);
						if (hash !== foundUser.password) {
							p.reject(self.LOGIN_FAILED);
						} else {
							foundUser.token = cryptoService.token();
							p.resolve(foundUser);
						}
					}, function (errorCode) {
						p.reject(errorCode);
					});
					
					return p.promise;
				}
				
				// Signup user
				self.signup = function (user) {
					var p = $q.defer();
					objectStoreService.findUserByEmail(user.email).then(function (user) {
						// User already exists
						p.reject(self.SIGNUP_FAILED);
					}, function (errorCode) {
						if (errorCode == null || errorCode != objectStoreService.USER_NOT_FOUND) {
							p.reject(errorCode);
						} else {
							var insertUser = {
								name: user.name,
								email: user.email,
								password: cryptoService.hash(user.password)
							};
		
							// Add new user
							objectStoreService.addUser(insertUser).then(function (addedUser) {
								// Login user to get access token
								self.login(user).then(function(user) {
									p.resolve(user);
								}, function (errorCode) {
									p.reject(errorCode);
								})
							}, function (errorCode) {
								p.reject(errorCode);
							});	
						}
					});
					
					return p.promise;
				}
			}
		]);
})();