Models.GenericManagerFindIntegrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    getTableModels: function($super) {
        return [{
            Name: "fruits",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                count: new Database.Types.Integer()
            }
        }];
    },

    getFixtures: function() {
        return [
            "INSERT INTO fruits VALUES(1, 'orange', 1);",
            "INSERT INTO fruits VALUES(2, 'lemon', 1);",
            "INSERT INTO fruits VALUES(3, 'cherry', 2);",
            "INSERT INTO fruits VALUES(4, 'banana', 1);",
            "INSERT INTO fruits VALUES(5, 'kiwi', 2);",
            "INSERT INTO fruits VALUES(6, 'watermelon', 1);"
        ];
    },

    test_should_return_non_null_model_instance_when_search_by_valid_id_done: function(recordResults) {
        this._manager.findById(1, (function(model) {
            Test.validateAndContinue(recordResults, Mojo.require.curry(model));
            Test.validate(recordResults, Mojo.requireEqual.curry(1, model.id));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_return_null_when_search_by_non_valid_id_done: function(reportResults) {
        this._manager.findById(11, (function(model) {
            Test.validate(reportResults, Mojo.requireEqual.curry(null, model));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_limit_number_of_returned_entities_when_limit_is_specified: function(reportResults) {
        this._manager.find(null, {limit: 2}, function(models) {
            Test.validate(reportResults, Mojo.requireEqual.curry(2, models.length));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_order_returned_entities_when_order_is_specified: function(reportResults) {
        this._manager.find(null, {order: "name"}, function(models) {
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry(6, models.length));
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry("banana", models[0].name));
            Test.validate(reportResults, Mojo.require.curry("watermelon", models[5].name));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_return_entities_starting_from_specified_offset: function(reportResults) {
        this._manager.find(null, {limit: 3, offset: 3}, function(models) {
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry(3, models.length));
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry("banana", models[0].name));
            Test.validate(reportResults, Mojo.requireEqual.curry("watermelon", models[2].name));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_return_ordered_entities_starting_from_specified_offset: function(reportResults) {
        this._manager.find(null, {order: "name", limit: 3, offset: 0}, function(models) {
            Test.validateAndContinue(reportResults, Mojo.requireEqual.curry("banana", models[0].name));
            Test.validate(reportResults, Mojo.requireEqual.curry("kiwi", models[2].name));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    },

    test_should_return_no_entities_when_offset_greater_than_count_specified: function(reportResults) {
        this._manager.find(null, {limit: 3, offset: 7}, function(models) {
            Test.validate(reportResults, Mojo.requireEqual.curry(0, models.length));
        }, Test.defaultDatabaseErrorCallback.curry(reportResults));
    }
});