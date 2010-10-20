Database.BaseMapperTest = Class.create(BaseDatabaseTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this.mapper = this.createMapper(this.db);
            completionCallback();
        }).bind(this));
    },

    createMapper: function() {
        Mojo.require(false, "Not implemented.");
    },

    getInitialCount: function() {
        Mojo.require(false, "Not implemented.");
    },

    createNewModel: function() {
        Mojo.require(false, "Not implemented.");
    },

    createUpdateModel: function() {
        Mojo.require(false, "Not implemented.");
    },

    test_save_should_fail_when_passed_model_is_null: function() {
        Test.requireException(this.mapper.save.curry(null));
        return Mojo.Test.passed;
    },

    test_save_should_fail_when_passed_model_id_exists: function() {
        var model = this.createUpdateModel();
        Test.requireException(this.mapper.save.curry(model));
        return Mojo.Test.passed;
    },

    test_save_should_correctly_create_model_record: function(recordResults) {
        var model = this.createNewModel();
        this.mapper.save(model, (function(modelId) {
            this.requireCount(recordResults, this.getInitialCount() + 1);
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_update_should_fail_when_new_model_passed: function() {
        var model = this.createNewModel();
        Test.requireException(this.mapper.save.curry(model));
        return Mojo.Test.passed;
    },

    test_update_should_correctly_update_exiting_model: function(recordResults) {
        var model = this.createUpdateModel();
        this.mapper.update(model, (function(modelId) {
            this.requireCount(recordResults, this.getInitialCount());
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_deleteById_should_correctly_delete_existing_model: function(recordResults) {
        this.mapper.deleteById(1, (function(affectedRows) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(1, affectedRows));
            this.requireCount(recordResults, this.getInitialCount() - 1);
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_deleteById_should_not_delete_anything_when_non_existing_model_specified: function(recordResults) {
        this.mapper.deleteById(10, (function(affectedRows) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(0, affectedRows));
            this.requireCount(recordResults, this.getInitialCount());
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_find_by_id_should_return_model_when_exists: function(recordResults) {
        this.mapper.findById(1, function(model) {
            Test.validate(recordResults, Mojo.require.curry(model));
        }, Test.databaseErrorHandler(recordResults));
    },

    test_find_by_id_should_return_null_when_model_does_not_exist: function(recordResults) {
        this.mapper.findById(10, function(model) {
            Test.validate(recordResults, Mojo.requireFalse.curry(model));
        }, Test.databaseErrorHandler(recordResults));
    },

    test_findAll_should_return_expected_models_number: function(recordResults) {
        this.mapper.findAll(Database.NO_LIMIT, 0, (function(models) {
            Test.validate(recordResults, Mojo.requireEqual.curry(this.getInitialCount(), models.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    requireCount: function(recordResults, expectedCount) {
        this.mapper.count(function(count) {
            Test.validate(recordResults, Mojo.requireEqual.curry(expectedCount, count));
        }, Test.databaseErrorHandler(recordResults));
    }
});