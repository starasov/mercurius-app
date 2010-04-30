/**
 * An utility class for asynchronous functions chaining.
 */
Utils.AsyncChain = Class.create({
    initialize: function(completionCallback, errorCallback) {
        Mojo.requireFunction(completionCallback, "'completionCallback' parameter should be a function.");
        Mojo.requireFunction(errorCallback, "'errorCallback' parameter should be a function.");

        this.successCallback = completionCallback;
        this.errorCallback = errorCallback;

        this.chain = []
    },

    isNotEmpty: function() {
        return this.chain.length != 0;    
    },

    add: function(callable) {
        Mojo.requireFunction(callable, "'callable' parameter should be a function.");
        this.chain.push(callable);
        return this;
    },

    call: function() {
        Mojo.require(this.chain.length > 0, "Chain contains no callable. You should populate the chain first.");

        var callback = function(nextCallableIndex, context) {
            if (nextCallableIndex < context.chain.length) {
                var nextCallable = context.chain[nextCallableIndex];
                nextCallable(callback.curry(nextCallableIndex + 1, context), context.errorCallback);
            } else {
                context.successCallback();
            }
        };

        var initialCallable = this.chain[0];
        initialCallable(callback.curry(1, this), this.errorCallback);
    }
});