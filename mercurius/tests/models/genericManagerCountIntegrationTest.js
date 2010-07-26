Models.GenericManagerCountIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getTableModels: function() {
        return [{
            Name: "count_table",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                value: new Database.Types.Integer()
            }
        }];
    },

    test_should_return_zero_when_no_records_in_table: function(recordResults) {
        this._ensure_count({}, 0, recordResults);
    },

    test_should_return_valid_count_of_records_in_table: function(recordResults) {
        this.executeStatements([
                "INSERT INTO count_table VALUES(1, 1);",
                "INSERT INTO count_table VALUES(2, 2);"
        ], (function(transaction, resultSet) {
            this._ensure_count({}, 2, recordResults);
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_correctly_search_for_count_of_records_when_search_parameters_is_passed: function(recordResults) {
        this.executeStatements([
            "INSERT INTO count_table VALUES(1, 1);",
            "INSERT INTO count_table VALUES(2, 2);",
            "INSERT INTO count_table VALUES(3, 2);",
            "INSERT INTO count_table VALUES(4, 3);"
        ], (function(transaction, resultSet) {
            this._ensure_count({value: 2}, 2, recordResults);
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    _ensure_count: function(searchParams, expectedCount, recordResults) {
        this._manager.count(searchParams, function(count) {
                        Test.validate(recordResults, Mojo.requireEqual.curry(expectedCount, count));
        }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    }});