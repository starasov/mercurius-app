Models.GenericManagerDeleteByIdIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getFixtures: function($super, tableModel) {
        return [
                "INSERT INTO test_table_1 VALUES(1);",
                "INSERT INTO test_table_1 VALUES(2);"
        ];
    }, 

    test_should_delete_record_from_database_when_record_exists: function(recordResults) {
        this._manager.deleteById(1,
                (function(rowsAffected) {
                    Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(1, rowsAffected));
                    this._manager.count(function(count) {
                                Test.validate(recordResults, Mojo.requireEqual.curry(1, count));
                            }, Test.defaultDatabaseErrorCallback.curry(recordResults));
                }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_return_zero_affected_rows_when_no_record_found: function(recordResults) {
        this._manager.deleteById(3,
            function(rowsAffected) {
                Test.validate(recordResults, Mojo.requireEqual.curry(0, rowsAffected));
            }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    }
});