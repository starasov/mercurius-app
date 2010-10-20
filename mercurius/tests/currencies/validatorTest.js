Currencies.ValidatorTest = Class.create(BaseDatabaseTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this.currencyFormFields = {
                name: {value: "USD"},
                symbol: {value: "$"},
                rate: {value: "1.0"}
            };

            this.mapper = new Currencies.Mapper(this.db);
            this.validator = new Currencies.Validator(Currencies.Fields, this.mapper, 1);

            completionCallback();
        }).bind(this));
    },

    test_validation_should_fail_when_empty_name_is_specified: function(recordResults) {
        this.currencyFormFields.name.value = "";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_whitespace_name_is_specified: function(recordResults) {
        this.currencyFormFields.name.value = "   ";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_currency_with_specified_name_already_exists: function(recordResults) {
        this.currencyFormFields.name.value = "Euro";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_empty_symbol_is_specified: function(recordResults) {
        this.currencyFormFields.symbol.value = "";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("symbol", key));
        });
    },

    test_validation_should_fail_when_empty_rate_is_specified: function(recordResults) {
        this.currencyFormFields.rate.value = "";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_fail_when_non_numeric_rate_is_specified: function(recordResults) {
        this.currencyFormFields.rate.value = "qwerty";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_fail_when_zero_rate_is_specified: function(recordResults) {
        this.currencyFormFields.rate.value = "0.0";
        this.validator.validate(this.currencyFormFields, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_be_succeeded_when_currency_editing_and_name_was_not_changed: function(recordResults) {
        this.validator.validate(this.currencyFormFields, recordResults, Prototype.emptyFunction);
    },

    getFixtures: function() {
        return [
            Mojo.appPath + "resources/database/currencies.json"
        ];
    }
});