(function () {
	'use strict'
	
	angular.module('MailzApp').service('ObjectStore', ['$scope', '$log', '$q', function ($scope, $log, $q) {
		$scope.db = null;
		
		$scope.onerror = function (errorCode) {
			$log.error('Database error ' + errorCode);
		}

		$scope.open = function () {
			var p = $q.defer();

			if ($scope.isOpened()) {
				p.resolve($scope.db);
				return p.promise;
			} 

			var request = indexedDB.open('MailzDB', 1);
			
			request.onerror = function (event) {
				var errorCode = event.target.errorCode;
				p.reject(errorCode);
				$scope.onerror(errorCode);
			}
			
			request.onsuccess = function (event) {
				$scope.db = event.target.result;
				$scope.db.onerror = $scope.onerror;
				p.resolve($scope.db);
			}
			
			request.onupgradeneeded = function (event) {
				var db = event.target.result;
				$scope.db.onerror = $scope.onerror;
				
				// Create users object store for this database
				var store = db.createObjectStore("users", { autoIncrement: true });
				store.createIndex("email", "email", { unique: true });
				store.createIndex("password", "password", { unique: true });

				$scope.db = db;
				p.resolve(db);				
			}

			return p.promise;
		}
		
		$scope.isOpened = function() {
			return $scope.db != null;
		}
	}]);
});