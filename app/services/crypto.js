; (function () {
	'use strict'

	angular.module('MailzApp')
		.service('cryptoService', ['$log', function ($log) {
			var self = this;

			self.hash = function (message) {
				return CryptoJS.SHA256(message).toString(CryptoJS.enc.Hex);
			}

			self.token = function () {
				return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
			}
		}]);
})();
