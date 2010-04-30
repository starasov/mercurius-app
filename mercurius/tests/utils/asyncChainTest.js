Utils.AsyncChainTest = Class.create({
    before: function() {
        this.successCallbackCalledCount = 0;
        this.errorCallbackCalledCount = 0;

        this.chain = new Utils.AsyncChain((function() {
            this.successCallbackCalledCount += 1;
        }).bind(this), (function() {
            this.errorCallbackCalledCount += 1;
        }).bind(this));

        return Mojo.Test.beforeFinished;
    },

    test_initialize_should_require_completion_callback_function: function() {
        Test.requireException(function() {
            new Utils.AsyncChain(null, Prototype.emptyFunction);    
        });

        return Mojo.Test.passed;
    },

    test_initialize_should_require_error_callback_function: function() {
        Test.requireException(function() {
            new Utils.AsyncChain(Prototype.emptyFunction, null);
        });

        return Mojo.Test.passed;
    },

    test_add_should_require_function: function() {
        Test.requireException((function() {
            this.chain.add(null);
        }).bind(this));
        
        return Mojo.Test.passed;
    },

    test_call_should_require_at_least_one_function_in_chain: function() {
        Test.requireException((function() {
            this.chain.call();
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_call_should_call_success_callback_when_all_chained_calls_successful: function() {
        this.chain.add(function(successCallback) { successCallback(); });

        this.chain.call();
        Mojo.require(1, this.successCallbackCalledCount);

        return Mojo.Test.passed;
    },

    test_call_should_call_error_callback_when_error_occurred: function() {
        this.chain.add(function(successCallback, errorCallback) { errorCallback(); });

        this.chain.call();
        Mojo.requireEqual(1, this.errorCallbackCalledCount);

        return Mojo.Test.passed;
    },

    test_call_should_stop_chain_calls_when_error_occurred: function() {
        this.chain.add(function(successCallback, errorCallback) { errorCallback(); });
        this.chain.add(function(successCallback) { successCallback(); });

        this.chain.call();
        Mojo.requireEqual(0, this.successCallbackCalledCount);

        return Mojo.Test.passed;
    },

    test_should_call_success_callback_only_once_when_chain_finished: function() {
        this.chain.add(function(successCallback) { successCallback(); });
        this.chain.add(function(successCallback) { successCallback(); });
        this.chain.add(function(successCallback) { successCallback(); });

        this.chain.call();
        Mojo.requireEqual(1, this.successCallbackCalledCount);

        return Mojo.Test.passed;
    }
});