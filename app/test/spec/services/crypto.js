/* global inject */
;(function () {
	'use strict'
	
	describe('Testing a cryptoService', function () {
		var cryptoService;
		
		beforeEach(function () {
			module('MailzApp');
			inject(function(_cryptoService_) {
				cryptoService = _cryptoService_;
			});
		});
		
		it('should have a hash function', function () {
			expect(angular.isFunction(cryptoService.hash)).toBe(true);
		});
		
		it('should return hex string from hash function', function () {
			var isHex = true;
			var hash = cryptoService.hash('').toUpperCase();
			for(var i = 0; i < hash.length; ++i) {
				var char = hash[i].charCodeAt(0);
				var isHexAlpha = char >= 'A'.charCodeAt(0) && char <= 'F'.charCodeAt(0);
				var isNum = char >= '0'.charCodeAt(0) && char <= '9'.charCodeAt(0);
				isHex = isHex && (isHexAlpha || isNum);
			}
			
			expect(isHex).toBe(true);
		});
		
		it('should have a token function', function () {
			expect(angular.isFunction(cryptoService.token)).toBe(true);
		});
	});	
})();
