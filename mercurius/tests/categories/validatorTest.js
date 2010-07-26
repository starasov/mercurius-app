Categories.ValidatorTest = Class.create({
    before: function() {
        this.categoryFormFields = {
            name: {value: "test"},
            parent_id: {value: "1"},
            type: {value: "1"}
        };

        this.manager = new MockGenericManager();
        this.validator = new Categories.Validator(this.manager, Categories.Fields);

        return Mojo.Test.beforeFinished;
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
        this.manager.findResults = [{/* assume that we find one*/}];
        this.validator.validate(this.categoryFormFields, function() {
            recordResults("Validation should fail for empty category name.");
        }, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    }
});