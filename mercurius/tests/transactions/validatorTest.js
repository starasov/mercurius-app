Transactions.ValidatorTest = Class.create({
    before: function() {
        this.formFields = {
            account_id: {value: "1"},
            amount: {value: "0.0"}
        };

        this.validator = new Transactions.Validator(Transactions.Fields);

        return Mojo.Test.beforeFinished;
    },

    test_should_pass_validation_when_all_fields_correctly_filled: function(recordResults) {
        this.validator.validate(this.formFields, recordResults, function(key, message) {
            recordResults("Validation should pass for '" + key + "' field.");
        });
    },

    test_should_fail_validation_when_non_numeric_account_id_specified: function(recordResults) {
        this.formFields.account_id.value = "one";
        this.validator.validate(this.formFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("account", key));
        });
    },

    test_should_fail_validation_when_zero_account_id_specified: function(recordResults) {
        this.formFields.account_id.value = "0";
        this.validator.validate(this.formFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("account", key));
        });
    },

    test_should_fail_validation_when_null_account_id_specified: function(recordResults) {
        this.formFields.account_id.value = null;
        this.validator.validate(this.formFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("account", key));
        });
    },

    test_should_fail_validation_when_empty_account_id_specified: function(recordResults) {
        this.formFields.account_id.value = "";
        this.validator.validate(this.formFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("account", key));
        });
    },

    test_should_fail_validation_when_non_numeric_opening_balance_specified: function(recordResults) {
        this.formFields.amount.value = "ten thousands";
        this.validator.validate(this.formFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("amount", key));
        })
    }
});