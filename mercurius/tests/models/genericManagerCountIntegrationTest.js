Models.GenericManagerCountIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    test_should_return_zero_when_no_records_in_table: function(reportResults) {
        Mojo.Log.info("[Models.GenericManagerCountIntegrationTest.test_should_return_zero_when_no_records_in_table] - begin");
        this._ensure_count(0, reportResults);
    },

    test_should_return_valid_count_of_records_in_table: function(reportResults) {
        this.executeStatements([
                "INSERT INTO test_table_1 VALUES(1);",
                "INSERT INTO test_table_1 VALUES(2);"
        ], (function(tr, resultSet) {
            this._ensure_count(2, reportResults);
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    _ensure_count: function(expectedCount, reportResults) {
        Mojo.Log.info("[Models.GenericManagerCountIntegrationTest._ensure_count] - begin");

        var genericManager = new Models.GenericManager(this._service.getDatabase(), this._mapper);
        genericManager.count(
                function(tr, count) {
                        Mojo.Log.info("[Models.GenericManagerCountIntegrationTest._ensure_count] - expected=%s actual=%s", expectedCount, count);
                        Test.validate(reportResults, Mojo.requireEqual.curry(expectedCount, count));
                }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    }
});