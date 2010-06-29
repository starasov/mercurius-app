Database.TransactionTest = Class.create({
    before: function() {
        this.db = new MockDatabase();
        this.transaction = new Database.Transaction(this.db);

        this.successCommand = function(expectedResultSet, transaction, successCallback, errorCallback, results) {
            successCallback(expectedResultSet);
        };

        this.errorCommand = function(transaction, successCallback, errorCallback, results) {
            errorCallback("errorCommandResult");
        };

        return Mojo.Test.beforeFinished;
    },

    test_should_initially_be_in_new_state: function() {
        Mojo.requireEqual(Database.TransactionState.New, this.transaction.state);
        return Mojo.Test.passed;
    },

    test_should_not_be_able_add_command_when_not_in_new_state: function() {
        this.transaction.addCommand("1", this.errorCommand);
        this.transaction.execute(Prototype.emptyFunction, Prototype.emptyFunction);
        this.db.callback();

        Test.requireException(this.transaction.addCommand.curry("1", this.errorCommand));

        return Mojo.Test.passed;

    },

    test_should_execute_error_callback_when_execution_failed: function(recordResults) {
        this.transaction.addCommand("1", this.errorCommand);
        this.transaction.execute(Prototype.emptyFunction, function(transaction, error) {
            recordResults();
        });
        this.db.callback();
    },

    test_should_switch_into_failed_state_when_execution_failed: function() {
        this.transaction.addCommand("1", this.errorCommand);
        this.transaction.execute(Prototype.emptyFunction, Prototype.emptyFunction);
        this.db.callback();

        Mojo.requireEqual(Database.TransactionState.Failed, this.transaction.state);

        return Mojo.Test.passed;
    },

    test_should_execute_success_callback_when_execution_completed: function(recordResults) {
        this.transaction.addCommand("1", this.successCommand.curry({}));

        this.transaction.execute(function(resultSet) {
            recordResults();
        }, Prototype.emptyFunction);

        this.db.callback();
    },

    test_should_propagate_all_results_when_execution_completed: function(recordResults) {
        this.transaction.addCommand("1", this.successCommand.curry("1"));
        this.transaction.addCommand("2", this.successCommand.curry("2"));
        this.transaction.addCommand("3", this.successCommand.curry("3"));

        this.transaction.execute(function(results) {
            Test.validate(recordResults, Test.requireMapsEqual.curry({1: "1", 2: "2", 3: "3"}, results));
        }, Prototype.emptyFunction);

        this.db.callback();
    },

    test_should_switch_into_completed_state_when_execution_finished: function() {
        this.transaction.addCommand("1", this.successCommand.curry({}));
        this.transaction.execute(Prototype.emptyFunction, Prototype.emptyFunction);
        this.db.callback();

        Mojo.requireEqual(Database.TransactionState.Completed, this.transaction.state);

        return Mojo.Test.passed;
    }
});