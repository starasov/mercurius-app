Accounts.ValidatorTest = Class.create({
    before: function() {
        this.accountFormFields = {
            name: {value: "cash"},
            opening_balance: {value: "0.0"},
            currency_id: {value: 1}
        };

        this.validator = new Accounts.Validator(Accounts.Fields);

        return Mojo.Test.beforeFinished;
    },

    test_should_pass_validation_when_all_fields_correctly_filled: function(recordResults) {
        this.validator.validate(this.accountFormFields, recordResults, function(key, message) {
            recordResults("Validation should pass for '" + key + "' field.");
        });
    },

    test_should_fail_validation_when_no_name_specified: function(recordResults) {
        this.accountFormFields.name.value = "";
        this.validator.validate(this.accountFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        })
    },

    test_should_fail_validation_when_blank_name_specified: function(recordResults) {
        this.accountFormFields.name.value = "  ";
        this.validator.validate(this.accountFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        })
    },

    test_should_fail_validation_when_non_numeric_opening_balance_specified: function(recordResults) {
        this.accountFormFields.opening_balance.value = "ten thousands";
        this.validator.validate(this.accountFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("opening_balance", key));
        })
    },
    
    test_should_fail_validation_when_negative_opening_balance_specified: function(recordResults) {
        this.accountFormFields.opening_balance.value = "-1.0";
        this.validator.validate(this.accountFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("opening_balance", key));
        })
    },

    test_should_pass_validation_when_positive_opening_balance_specified: function(recordResults) {
        this.accountFormFields.opening_balance.value = "1.0";
        this.validator.validate(this.accountFormFields, recordResults, Prototype.emptyFunction);
    },

    test_should_fail_validation_when_non_numeric_currency_id_specified: function(recordResults) {
        this.accountFormFields.currency_id.value = "one";
        this.validator.validate(this.accountFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("currency_id", key));
        });
    },

    test_should_fail_validation_when_zero_currency_id_specified: function(recordResults) {
        this.accountFormFields.currency_id.value = 0;
        this.validator.validate(this.accountFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("currency_id", key));
        });
    }
});