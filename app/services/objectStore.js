(function () {
	'use strict'

	angular.module(APPLICATION_NAME)
		.service('objectStoreService', ['$log', '$q', function ($log, $q) {
			var self = this;

			self.USER_NOT_FOUND = "User not found.";

			self.db = null;

			self.onerror = function (errorCode) {
				$log.error('Database error: ' + errorCode.message);
			}

			self.open = function () {
				var p = $q.defer();

				if (self.isOpened()) {
					p.resolve(self.db);
					return p.promise;
				}

				var request = indexedDB.open('MailzDB', 1);

				request.onerror = function (event) {
					var errorCode = event.target.errorCode;
					p.reject(errorCode);
					self.onerror(errorCode);
				}

				request.onsuccess = function (event) {
					self.db = event.target.result;
					self.db.onerror = self.onerror;
					p.resolve(self.db);
				}

				request.onupgradeneeded = function (event) {
					var db = event.target.result;
					self.db = db;
					self.db.onerror = self.onerror;
				
					// Create users object store for this database
					var objectStore = db.createObjectStore("users", { autoIncrement: true });
					objectStore.createIndex("email", "email", { unique: true });
					objectStore.createIndex("token", "token", { unique: true });

					objectStore.transaction.onsuccess = function (event) {
						var db = event.target.result;
						p.resolve(db);
					}

					objectStore.transaction.onerror = function (event) {
						var errorCode = event.target.result;
						p.reject(errorCode);
					}
				}

				return p.promise;
			}

			self.isOpened = function () {
				return self.db != null;
			}

			self.addUser = function (user) {
				var p = $q.defer();
				self.open().then(function (db) {
					var transaction = db.transaction(['users'], 'readwrite');
					var objectStore = transaction.objectStore('users');
					var request = objectStore.add(user);
					request.onsuccess = function (event) {
						var userId = event.target.result;
						p.resolve(userId);
					}
					request.onerror = function (event) {
						var errorCode = event.target.error;
						p.reject(errorCode);
					}
				}, function (errorCode) {
					p.reject(errorCode);
				});

				return p.promise;
			}

			self.findUserByEmail = function (email) {
				var p = $q.defer();
				self.open().then(function (db) {
					var transaction = db.transaction(['users'], 'readwrite');
					var objectStore = transaction.objectStore('users');
					var index = objectStore.index('email');
					var request = index.get(email);
					request.onsuccess = function (event) {
						var user = event.target.result;
						if (!user) {
							p.reject(self.USER_NOT_FOUND);
						} else {
							p.resolve(user);
						}
					}
					request.onerror = function (event) {
						var errorCode = event.target.error;
						p.reject(errorCode);
					}

				}, function (errorCode) {
					p.reject(errorCode);
				});

				return p.promise;
			}
		}]);
})();