Models.GenericManagerFindIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getTableModel: function($super) {
        return {
            Name: "fruits",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                count: new Database.Types.Integer()
            }
        };
    },

    getFixtures: function($super, tableModel) {
        return $super(tableModel).concat([
                "INSERT INTO fruits VALUES(1, 'orange', 1);",
                "INSERT INTO fruits VALUES(2, 'lemon', 1);",
                "INSERT INTO fruits VALUES(3, 'cherry', 2);",
                "INSERT INTO fruits VALUES(4, 'banana', 1);",
                "INSERT INTO fruits VALUES(5, 'kiwi', 2);",
                "INSERT INTO fruits VALUES(6, 'watermelon', 1);"
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
        genericManager.findById(11, (function(tr, entity) {
            Test.validate(reportResults, Mojo.requireEqual.curry(null, entity));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_limit_number_of_returned_entities_when_limit_is_specified: function(reportResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);
        genericManager.find(null, {limit: 2}, function(tr, resultSet) {
            Test.validate(reportResults, Mojo.requireEqual.curry(2, resultSet.length()));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_order_returned_entities_when_order_is_specified: function(reportResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);
        genericManager.find(null, {order: "name"}, function(tr, resultSet) {
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry(6, resultSet.length()));
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry("banana", resultSet.item(0).name));
            Test.validate(reportResults, Mojo.require.curry("watermelon", resultSet.item(5).name));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_return_entities_starting_from_specified_offset: function(reportResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);
        genericManager.find(null, {limit: 3, offset: 3}, function(tr, resultSet) {
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry(3, resultSet.length()));
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry("banana", resultSet.item(0).name));
            Test.validate(reportResults, Mojo.requireEqual.curry("watermelon", resultSet.item(2).name));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_return_no_entities_when_offset_greater_than_count_specified: function(reportResults) {
        var genericManager = new Models.GenericManager(this._db, this._mapper);
        genericManager.find(null, {limit: 3, offset: 7}, function(tr, resultSet) {
            Test.validate(reportResults, Mojo.requireEqual.curry(0, resultSet.length()));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    }
});