var MockTransaction = Class.create({
    initialize: function(success) {
        this.success = success;
        this.executedCount = 0;
    },

    executeSql: function(sql, parameters, successHandler, errorHandler) {
        this.executedCount++;

        this.sql = sql;
        this.parameters = parameters;

        if (this.success) {
            successHandler();
        } else {
            errorHandler();
        }
    }
});

var MockDatabase = Class.create({
    initialize: function(autoExecuteStatements) {
        this.autoExecuteStatements = autoExecuteStatements;
        this.executedTransactions = []
    },

    transaction: function(callback) {
        this.callback = callback;

        if (this.autoExecuteStatements) {
            var transaction = new MockTransaction(true);
            this.executedTransactions.push(transaction);
            this.callback(transaction);
        }
    },

    getTotalExecutedCount: function() {
        return this.executedTransactions.inject(0, function(acc, transaction) {
            return acc + transaction.executedCount; 
        });
    }
});

// ToDO: rewrite to something like null/manual/in-memory provider. This one look ugly.
var MockVersionProvider = Class.create({
   hasCurrentVersion: function() {
       return false;
   }
});

var MockController = Class.create({
    initialize: function() {
        this.setupWidgetCalls = [];
        this.listenCalls = [];
        this.stopListeningCalls = [];
        this.setWidgetModelCalls = [];
    },

    setupWidget: function(id, attributes, model) {
        this.setupWidgetCalls.push({id: id, attributes: attributes, model: model});
    },

    listen: function(id, event, listener) {
        this.listenCalls.push({id: id, event: event, listener: listener});
    },

    stopListening: function(id, event, listener) {
        this.stopListeningCalls.push({id: id, event: event, listener: listener});
    },

    setWidgetModel: function(id, model) {
        this.setWidgetModelCalls.push({id: id, model: model});
    }
});