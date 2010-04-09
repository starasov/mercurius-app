Models.GenericManagerDeleteByIdIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getFixtures: function($super, tableModel) {
        return [
                "INSERT INTO test_table_1 VALUES(1);",
                "INSERT INTO test_table_1 VALUES(2);"
        ];
    }, 

    test_should_delete_record_from_database_when_record_exists: function(recordResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);

        genericManager.deleteById(1,
                function(tr, resultSet) {
                    Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(1, resultSet.rowsAffected));
                    genericManager.count(function(tr, count) {
                                Test.validate(recordResults, Mojo.requireEqual.curry(1, count));
                            }, Test.defaultDatabaseErrorCallback.curry(recordResults));
                }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_return_zero_affected_rows_when_no_record_found: function(recordResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);

        genericManager.deleteById(3,
            function(tr, resultSet) {
                Test.validate(recordResults, Mojo.requireEqual.curry(0, resultSet.rowsAffected));
            }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    }
});