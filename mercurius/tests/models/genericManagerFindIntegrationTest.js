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

    test_should_return_single_value_when_search_by_id_done: function(reportResults) {
        var genericManager = new Models.GenericManager(this._service.getDatabase(), this._mapper);
        genericManager.findById(1, (function(tr, resultSet) {
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry(1, resultSet.length()));
            Test.validate(reportResults, Mojo.requireEqual.curry(1, resultSet.item(0).id));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(reportResults));
    }
});