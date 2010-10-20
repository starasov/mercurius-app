Categories.ValidatorTest = Class.create(BaseDatabaseTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this.categoryFormFields = {
                name: {value: "test"},
                parent_id: {value: "1"},
                type: {value: "1"}
            };

            this.mapper = new Categories.Mapper(this.db);
            this.validator = new Categories.Validator(this.mapper, 2, Categories.Fields);

            completionCallback();
        }).bind(this));
    },

    test_should_pass_validation_when_all_fields_correctly_filled: function(recordResults) {
        this.validator.validate(this.categoryFormFields, recordResults, function(key, message) {
            recordResults("Validation should pass for '" + key + "' field.");
        });
    },

    test_should_fail_validation_when_empty_name_field_passed: function(recordResults) {
        this.categoryFormFields.name.value = "";
        this.validator.validate(this.categoryFormFields, function() {
            recordResults("Validation should fail for empty category name.");
        }, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_should_fail_validation_when_category_with_specified_name_already_exists: function(recordResults) {
        this.categoryFormFields.name.value = "Food";
        this.categoryFormFields.parent_id.value = "0";

        this.validator.validate(this.categoryFormFields, function() {
            recordResults("Validation should fail for duplicated category name.");
        }, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_should_pass_validation_when_category_was_editing_and_name_was_not_changed: function(recordResults) {
        this.validator.validate(this.categoryFormFields, recordResults, function(key, message) {
            recordResults("Validation should pass for '" + key + "' field.");
        });
    },

    getFixtures: function() {
        return [
            Mojo.appPath + "resources/database/categories.json"
        ];
    }
});