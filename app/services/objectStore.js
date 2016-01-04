'use strict';

/* global define */
/* global indexedDB */
/* jshint esversion: 6 */

define(
  [
    'lodash',
    'app'
  ],

  function (_, app) {
    app.register.service('objectStoreService',
      [
        '$log',
        '$q',

        function ($log, $q) {
          var self = this;

          self.ACCOUNT_NOT_FOUND = 'Account not found.';
          self.USER_NOT_FOUND = 'User not found.';

          self.db = null;

          self.onerror = function (err) {
            $log.error('Database error: ' + err.message);
          };

          self.open = function () {
            var p = $q.defer();

            if (self.isOpened()) {
              p.resolve(self.db);
              return p.promise;
            }

            var request = indexedDB.open('MailzDB', 1);

            request.onerror = function (event) {
              var error = event.target.errorCode;
              p.reject(error);
              self.onerror(error);
            };

            request.onsuccess = function (event) {
              self.db = event.target.result;
              self.db.onerror = self.onerror;
              p.resolve(self.db);
            };

            request.onupgradeneeded = function (event) {
              var db = event.target.result;
              self.db = db;
              self.db.onerror = self.onerror;

              // Create users object store for this database
              var futureUsers = $q.defer();
              var objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
              objectStore.createIndex('email', 'email', { unique: true });
              objectStore.createIndex('token', 'token', { unique: true });

              objectStore.transaction.onsuccess = function (event) {
                var db = event.target.result;
                futureUsers.resolve(db);
              };

              objectStore.transaction.onerror = function (event) {
                var error = event.target.result;
                futureUsers.reject(error);
                $log.error(error.message);
              };

              var futureAccounts = $q.defer();
              objectStore = db.createObjectStore('accounts', { keyPath: 'id', autoIncrement: true });
              objectStore.createIndex('userId', 'userId');
              objectStore.createIndex('imapAccountId', 'imapAccountId', { unique: true });
              objectStore.createIndex('smtpAccountId', 'smtpAccountId', { unique: true });

              objectStore.transaction.onsuccess = function (event) {
                var db = event.target.result;
                futureAccounts.resolve(db);
              };

              objectStore.transaction.onerror = function (event) {
                var error = event.target.result;
                futureAccounts.reject(error);
                $log.error(error.message);
              };

              var futureImapAccounts = $q.defer();
              objectStore = db.createObjectStore('imapAccounts', { keyPath: 'id', autoIncrement: true });

              objectStore.transaction.onsuccess = function (event) {
                var db = event.target.result;
                futureImapAccounts.resolve(db);
              };

              objectStore.transaction.onerror = function (event) {
                var error = event.target.result;
                futureImapAccounts.reject(error);
                $log.error(error.message);
              };

              var futureSmtpAccounts = $q.defer();
              objectStore = db.createObjectStore('smtpAccounts', { keyPath: 'id', autoIncrement: true });

              objectStore.transaction.onsuccess = function (event) {
                var db = event.target.result;
                futureSmtpAccounts.resolve(db);
              };

              objectStore.transaction.onerror = function (event) {
                var error = event.target.result;
                futureSmtpAccounts.reject(error);
                $log.error(error.message);
              };

              $q.all([
                futureUsers.promise,
                futureAccounts.promise,
                futureImapAccounts.promise,
                futureSmtpAccounts.promise
              ]).then(function (result) {
                p.resolve(db);
              }, function (err) {
                p.reject(err);
                $log.error(err.message);
              });
            };

            return p.promise;
          };

          self.isOpened = function () {
            return self.db !== null;
          };

          self.transact = function (stores, type) {
            var p = $q.defer();
            self.open().then(function (db) {
              var transaction = db.transaction(stores, type);
              p.resolve(transaction);
            }, function (err) {
              p.reject(err);
              $log.error(err.message);
            });

            return p.promise;
          };

          self.complete = function (stores, tr, requester) {
            var p = $q.defer();

            var requestResolver = function (request) {
              if (request.onsuccess === undefined || request.onsuccess === null) {
                request.onsuccess = function (event) {
                  p.resolve(event.target.result);
                };
              }
              if (request.onerror === undefined || request.onerror === null) {
                request.onerror = function (event) {
                  $log.error(event.target.error);
                  p.reject(event.target.error);
                };
              }
            };

            var completer = function (tr) {
              try {
                var request = requester(tr);
                // FIXME: Check if it's a promise or not
                if (typeof request.then === 'function') {
                  request.then(function (request) {
                    requestResolver(request);
                  }, function (error) {
                    p.reject(error);
                    $log.error(error.message);
                  });
                } else {
                  requestResolver(request);
                }
              } catch (err) {
                // DOMException will cause any pending tansaction to commit
                // So this is just to better display exception
                p.reject(err);
              }
            };

            if (tr === undefined) {
              self.open().then(function (db) {
                var tr = db.transaction(stores, 'readwrite');
                completer(tr);
              }, function (err) {
                p.reject(err);
                $log.error(err.message);
              });
            } else {
              completer(tr);
            }

            return p.promise;
          };

          self.addUser = function (user, tr) {
            return self.complete(['users'], tr, function (tr) {
              return tr.objectStore('users').add(user);
            });
          };

          self.findUserByEmail = function (email, tr) {
            return self.complete(['users'], tr, function (tr) {
              return tr.objectStore('users').index('email').get(email);
            });
          };

          self.addAccount = function (account, tr) {
            return self.complete(['accounts'], tr, function (tr) {
              return tr.objectStore('accounts').add(account);
            });
          };

          self.findAccount = function (id, tr) {
            return self.complete(['accounts'], tr, function (tr) {
              return tr.objectStore('accounts').get(id);
            });
          };

          self.findAllUserAccounts = function (userId, tr) {
            return self.complete(['accounts'], tr, function (tr) {
              var p = $q.defer();
              var accounts = [];
              var request = tr.objectStore('accounts').index('userId').openKeyCursor();
              request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor && cursor.key === userId) {
                  accounts.push(cursor.value);
                  cursor.continue();
                } else {
                  // No more entries
                  p.resolve(accounts);
                }
              };
              request.onerror = function (event) {
                p.reject(event.target.error);
                $log.error(event.target.error);
              };

              return p.promise;
            });
          };

          self.updateAccount = function (account, tr) {
            return self.complete(['accounts'], tr, function (tr) {
              var p = $q.defer();
              self.findAccount(account.id).then(function () {
                p.resolve(tr.objectStore('accounts').put(account));
              }, function (err) {
                p.reject(err);
              });

              return p.promise;
            });
          };

          self.addImapAccount = function (imap, tr) {
            return self.complete(['imapAccounts'], tr, function (tr) {
              return tr.objectStore('imapAccounts').add(imap);
            });
          };

          self.updateImapAccount = function (imap, tr) {
            return self.complete(['imapAccounts'], tr, function (tr) {
              var p = $q.defer();
              if (typeof imap.id === 'undefined') {
                p.reject(new Error('Property id is not defined'));
              } else {
                self.findAccount(imap.id).then(function () {
                  p.resolve(tr.objectStore('imapAccounts').put(imap));
                }, function (err) {
                  p.reject(err);
                });
              }

              return p.promise;
            });
          };

          self.addSmtpAccount = function (smtp, tr) {
            return self.complete(['smtpAccounts'], tr, function (tr) {
              return tr.objectSore('smtpAccounts').add(smtp);
            });
          };

          self.updateSmtpAccount = function (smtp, tr) {
            return self.complete(['smtpAccounts'], tr, function (tr) {
              var p = $q.defer();
              if (typeof smtp.id === 'undefined') {
                p.reject(new Error('Property id is not defined'));
              } else {
                self.findSmtpAccount(smtp.id).then(function () {
                  p.resolve(tr.objectStore('smtpAccounts').put(smtp));
                }, function (err) {
                  p.reject(err);
                });
              }

              return p.promise;
            });
          };

          self.saveOptions = function (user, options) {
            return self.transact(['accounts', 'imapAccounts', 'smtpAccounts'], 'readwrite')
              .then(function (tr) {
                return $q.all(_.map(options.accounts, function (account) {
                  if (typeof account === 'undefined' || account === null) {
                    return $q.resolve();
                  }

                  var futureImap = $q.defer();
                  if (typeof account.imap !== 'undefined' && account.imap !== null) {
                    if (typeof account.imap.id === 'undefined' || account.imap.id === null) {
                      futureImap.resolve(self.addImapAccount(account.imap, tr));
                    } else {
                      futureImap.resolve(self.updateImapAccount(account.imap, tr));
                    }
                  } else {
                    futureImap.resolve();
                  }

                  var futureSmtp = $q.defer();
                  if (typeof account.smtp !== 'undefined' && account.smtp !== null) {
                    if (typeof account.smtp.id === 'undefined' || account.smtp.id === null) {
                      futureSmtp.resolve(self.addImapAccount(account.smtp, tr));
                    } else {
                      futureSmtp.resolve(self.updateImapAccount(account.smtp, tr));
                    }
                  } else {
                    futureSmtp.resolve();
                  }

                  return $q.all([
                    futureImap.promise,
                    futureSmtp.promise
                  ])
                    .then(function (list) {
                      var account = {
                        userId: user.id,
                        imapAccountId: list[0],
                        smtpAccountId: list[1]
                      };

                      if (typeof account.id === 'undefined' || account.id === null) {
                        return self.addAccount(account, tr);
                      } else {
                        return self.updateAccount(account, tr);
                      }
                    }, function (err) {
                      return err;
                    });
                }));
              });
          };
        }]);
  });
