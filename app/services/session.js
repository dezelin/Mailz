; (function () {
	'use strict'

	angular.module('MailzApp')
		.service('sessionService', ['$log', function ($log) {
			var self = this;
			self.user = {};

			self.setUser = function (user) {
				self.user = user;
			}

			self.getUser = function () {
				return self.user;
			}
		}]);
})();