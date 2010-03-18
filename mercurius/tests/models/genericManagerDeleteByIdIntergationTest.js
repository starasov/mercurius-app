Models.GenericManagerDeleteByIdIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getFixtures: function($super, tableModel) {
        return $super(tableModel).concat([
                "INSERT INTO test_table_1 VALUES(1);",
                "INSERT INTO test_table_1 VALUES(2);"
        ]);
    }, 

    test_should_delete_record_from_database_when_record_exists: function(reportResults) {
        var genericManager = new Models.GenericManager(this._service.getDatabase(), this._mapper);

        genericManager.deleteById(1,
                function(tr, resultSet) {
                    Test.validateAndContinue(reportResults, Mojo.requireEqual.curry(1, resultSet.rowsAffected));
                    genericManager.count(function(tr, count) {
                                Test.validate(reportResults, Mojo.requireEqual.curry(1, count));
                            }, Test.defaultDatabaseErrorCallback.curry(reportResults));
                }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_return_zero_affected_rows_when_no_record_found: function(reportResults) {
        var genericManager = new Models.GenericManager(this._service.getDatabase(), this._mapper);

        genericManager.deleteById(3,
            function(tr, resultSet) {
                Test.validate(reportResults, Mojo.requireEqual.curry(0, resultSet.rowsAffected));
            }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    }
});