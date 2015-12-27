/* global jasmine */
;(function() {

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.addReporter(new jasmine.HtmlReporter());
    jasmineEnv.execute();
	
})();
