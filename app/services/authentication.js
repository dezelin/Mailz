/* global CryptoJS */
(function () {
	'use strict'
	
	angular.module('MailzApp').service('Authentication', function() {
		this.authenticate = function (password) {
			var hash = CryptoJS.SHA256(password);
			return true
		}
	});
})();