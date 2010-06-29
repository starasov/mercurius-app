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
        this.executionResults = {};
    },

    addCommand: function(name, command) {
        Mojo.require(name, "'name' parameter can't be null.");
        Mojo.require(command, "'command' parameter can't be null.");
        Mojo.requireEqual(Database.TransactionState.New, this.state);

        this.commands.push({name: name, command: command});
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
            clientSuccessCallback(this.executionResults);
        }).bind(this), this._errorCallback.bind(this, clientErrorCallback));

        for (var i = 0; i < this.commands.length; i++) {
            var commandName = this.commands[i].name;
            var command = this.commands[i].command;

            asyncChain.add(this._createCommandChunk(commandName, command, transaction));
        }

        asyncChain.call();
    },

    /** @private */
    _createCommandChunk: function(commandName, command, transaction) {
        return (function(command, transaction, successCallback, errorCallback) {
            command(transaction, this._successCallback.bind(this, commandName, successCallback), errorCallback, this.executionResults);
        }).bind(this, command, transaction);
    },

    /** @private */
    _successCallback: function(commandName, chainSuccessCallback, result) {
        this.executionResults[commandName] = result;
        chainSuccessCallback();
    },

    /** @private */
    _errorCallback: function(clientErrorCallback, transaction, error) {
        this.state = Database.TransactionState.Failed;
        clientErrorCallback(transaction, error);
    }
});