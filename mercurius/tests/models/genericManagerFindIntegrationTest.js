Models.GenericManagerFindIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getTableModel: function($super) {
        return {
            Name: "test_table_1",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                count: new Database.Types.Integer()
            }
        };
    },

    getFixtures: function($super, tableModel) {
        return $super(tableModel).concat([
                "INSERT INTO test_table_1 VALUES(1, 'orange', 1);",
                "INSERT INTO test_table_1 VALUES(2, 'lemon', 2);",
                "INSERT INTO test_table_1 VALUES(3, 'cherry', 3);"
        ]);
    },

    test_should_return_non_null_model_instance_when_search_by_valid_id_done: function(recordResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);
        genericManager.findById(1, (function(tr, entity) {
            Test.validateAndContinue(recordResults, Mojo.require.curry(entity));
            Test.validate(recordResults, Mojo.requireEqual.curry(1, entity.id));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_return_null_when_search_by_non_valid_id_done: function(reportResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);
        genericManager.findById(4, (function(tr, entity) {
            Test.validate(reportResults, Mojo.requireEqual.curry(null, entity));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(reportResults));
    }
});