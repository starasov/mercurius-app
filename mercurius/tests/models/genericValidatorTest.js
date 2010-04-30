var TestValidator = Class.create(Models.GenericValidator, {
});

Models.GenericValidatorTest = Class.create({
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
            }
        };

        this.validator = new Models.GenericValidator(this.fields);
        
        return Mojo.Test.beforeFinished;
    },

    test_initialize_should_fail_when_null_fields_passed: function() {
        Test.requireException((function() {
            new Models.GenericValidator(null);
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
        this.validator._validate = (function(fieldData, successCallback, errorCallback) {
            this.validateCalled = true;
        }).bind(this);

        this.validator.validate(this.fields, Prototype.emptyFunction, Prototype.emptyFunction);
        Mojo.require(this.validateCalled);

        return Mojo.Test.passed;
    }

//    test_update_should_call_validation_callback_with_success_result_when_no_error_found: function() {
//        this.form.setup(this.controller, this.validationCallback);
//        this.validationResult = null;
//
//        this.form.update({});
//
//        Mojo.requireEqual(Models.GenericForm.ValidationSuccess, this.validationResult);
//
//        return Mojo.Test.passed;
//    },

//    test_update_should_call_validation_callback_with_error_result_when_field_validation_fails: function() {
//        this.form.setup(this.controller, this.validationCallback);
//        this.validationResult = null;
//
//        this.form.validateName = function(model, successCallback, errorCallback) { errorCallback(); };
//        this.form.update({});
//
//        Mojo.requireEqual(Models.GenericForm.ValidationError, this.validationResult);
//
//        return Mojo.Test.passed;
//    },

//    test_should_call_validation_callback_with_error_result_when_form_validation_fails: function() {
//        this.form.setup(this.controller, this.validationCallback);
//        this.validationResult = null;
//
//        this.form.validate = function(model, successCallback, errorCallback) { errorCallback(); };
//        this.form.update({});
//
//        Mojo.requireEqual(Models.GenericForm.ValidationError, this.validationResult);
//
//        return Mojo.Test.passed;
//    },

//    test_should_call_validation_callback_with_error_result_when_field_validation_errors_found: function() {
//        this.form.setup(this.controller, this.validationCallback);
//        this.validationResult = null;
//
//        this.form.validate = function(model, successCallback, errorCallback) { errorCallback(); };
//        this.form.update({});
//
//        Mojo.requireEqual(Models.GenericForm.ValidationError, this.validationResult);
//
//        return Mojo.Test.passed;
//    }
    
});