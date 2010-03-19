var MockTransaction = Class.create({
    executeSql: function(sql, parameters, successHandler, errorHandler) {
        this.sql = sql;
        this.parameters = parameters;
        this.successHandler = successHandler;
        this.errorHandler = errorHandler;
    }
});

var MockDatabase = Class.create({
    transaction: function(callback) {
        this.transactionCalled = true;
        this.callback = callback;
    }
});