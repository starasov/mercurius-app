Database.TransactionState = {
    New: "new",
    Completed: "completed",
    Failed: "failed"
};

Database.Transaction = Class.create({
    log: Mojo.Log,
    
    /** @constructor */
    initialize: function(db) {
        Mojo.require(db, "'db' parameter can't be null.");

        this.db = db;
        this.commands = [];
        this.state = Database.TransactionState.New;
        this.executionContext = {};
    },

    addCommand: function(command, commandExecutedCallback) {
        Mojo.require(command, "'command' parameter can't be null.");
        Mojo.requireEqual(Database.TransactionState.New, this.state);

        this.commands.push({command: command, callback: commandExecutedCallback});
    },

    execute: function(successCallback, errorCallback) {
        Mojo.require(this.commands.length > 0);
        Mojo.requireEqual(Database.TransactionState.New, this.state);
        
        this.db.transaction(this._executeWithTransaction.bind(this, successCallback, errorCallback));
    },

    /** @private */
    _executeWithTransaction: function(clientSuccessCallback, clientErrorCallback, transaction) {
        var asyncChain = new Utils.AsyncChain((function() {
            this.state = Database.TransactionState.Completed;
            clientSuccessCallback(this.executionContext);
        }).bind(this), this._errorCallback.bind(this, clientErrorCallback));

        for (var i = 0; i < this.commands.length; i++) {
            var command = this.commands[i].command;
            var commandExecutedCallback = this.commands[i].callback;

            asyncChain.add(this._createCommandChunk(command, commandExecutedCallback, transaction));
        }

        asyncChain.call();
    },

    /** @private */
    _createCommandChunk: function(command, commandExecutedCallback, transaction) {
        return (function(successCallback, errorCallback) {
            command(transaction,
                    this._successCallback.bind(this, commandExecutedCallback, successCallback),
                    errorCallback,
                    this.executionContext);
        }).bind(this);
    },

    /** @private */
    _successCallback: function(commandExecutedCallback, chainSuccessCallback, result) {
        if (commandExecutedCallback) {
            commandExecutedCallback(this.executionContext, result);
        }

        chainSuccessCallback();
    },

    /** @private */
    _errorCallback: function(clientErrorCallback, transaction, error) {
        this.state = Database.TransactionState.Failed;
        clientErrorCallback(transaction, error);
    }
});