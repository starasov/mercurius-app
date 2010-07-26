Validation.GenericValidatorTest = Class.create({
    before: function() {
        this.fields = {
            name: {
                id: "name-id",
                attributes: "name-attributes",
                changeEvent: "name-changeEvent",
                toFormData: function() { return "name-toFormData"; },
                fromFormData: function() { return "name-fromFormData"; }
            },

            age: {
                id: "age-id",
                attributes: "age-attributes",
                changeEvent: "age-changeEvent"
            },

            weight: {
                id: "weight-id",
                attributes: "weight-attributes",
                changeEvent: "weight-changeEvent"
            },

            closed_flag: {
                id: "closed-id",
                attributes: "closed-attributes",
                changeEvent: "closed-changeEvent"
            }
        };

        this.validator = new Validation.GenericValidator(this.fields);
        
        return Mojo.Test.beforeFinished;
    },

    test_initialize_should_fail_when_null_fields_passed: function() {
        Test.requireException((function() {
            new Validation.GenericValidator(null);
            this.form.setup(null);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_validate_should_fail_when_null_fields_data_passed: function() {
        Test.requireException((function() {
            this.validator.validate(null, Prototype.emptyFunction, Prototype.emptyFunction);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_validate_should_fail_when_null_success_callback_passed: function() {
        Test.requireException((function() {
            this.validator.validate(this.fields, null, Prototype.emptyFunction);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_validate_should_fail_when_null_error_callback_passed: function() {
        Test.requireException((function() {
            this.validator.validate(this.fields, Prototype.emptyFunction, null);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_validate_should_call_validate_function_per_field_when_function_exists: function() {
        this.validator._validateName = (function(fieldData, successCallback, errorCallback) {
            this.validateNameCalled = true;
        }).bind(this);

        this.validator.validate(this.fields, Prototype.emptyFunction, Prototype.emptyFunction);
        Mojo.require(this.validateNameCalled);

        return Mojo.Test.passed;
    },

    test_validate_should_call_form_validate_function_function_exists: function() {
        this.validator._validate = (function(fieldsModels, fieldsDescriptors, successCallback, errorCallback) {
            this.validateCalled = true;
        }).bind(this);

        this.validator.validate(this.fields, Prototype.emptyFunction, Prototype.emptyFunction);
        Mojo.require(this.validateCalled);

        return Mojo.Test.passed;
    },

    test_validate_should_call_validate_function_for_field_with_underscores_in_name: function() {
        this.validator._validateClosedFlag = (function(fieldData, successCallback, errorCallback) {
            this.validateCalled = true;
        }).bind(this);

        this.validator.validate(this.fields, Prototype.emptyFunction, Prototype.emptyFunction);
        Mojo.require(this.validateCalled);

        return Mojo.Test.passed;
    },

    test_update_should_call_validation_callback_with_result_when_no_errors_found: function(recordResults) {
        this.validator._validate = (function(fieldsModels, fieldsDescriptors, successCallback, errorCallback) {
            successCallback();
        }).bind(this);

        this.validator.validate(this.fields, recordResults, Prototype.emptyFunction);
    },

    test_update_should_call_validation_callback_with_error_result_when_field_validation_fails: function(recordResults) {
        this.validator._validate = (function(fieldsModels, fieldsDescriptors, successCallback, errorCallback) {
            errorCallback();
        }).bind(this);

        this.validator.validate(this.fields, Prototype.emptyFunction, recordResults);
    }
});