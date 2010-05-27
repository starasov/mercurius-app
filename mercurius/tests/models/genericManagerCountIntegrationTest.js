Models.GenericManagerCountIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    test_should_return_zero_when_no_records_in_table: function(recordResults) {
        this._ensure_count(0, recordResults);
    },

    test_should_return_valid_count_of_records_in_table: function(recordResults) {
        this.executeStatements([
                "INSERT INTO test_table_1 VALUES(1);",
                "INSERT INTO test_table_1 VALUES(2);"
        ], (function(transaction, resultSet) {
            this._ensure_count(2, recordResults);
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    _ensure_count: function(expectedCount, recordResults) {
        this._manager.count(function(count) {
                        Test.validate(recordResults, Mojo.requireEqual.curry(expectedCount, count));
        }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    }});