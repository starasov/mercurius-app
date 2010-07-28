Currencies.ValidatorTest = Class.create({
    before: function() {
        this._currenciesManager = new Currencies.MockManager();
        this._validator = new Currencies.Validator(Currencies.Fields, this._currenciesManager, 1);

        this._currencyData = {
            name: {value: "USD"},
            symbol: {value: "$"},
            rate: {value: "1.0"}
        };

        return Mojo.Test.beforeFinished;
    },

    test_validation_should_fail_when_empty_name_is_specified: function(recordResults) {
        this._currencyData.name.value = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_whitespace_name_is_specified: function(recordResults) {
        this._currencyData.name.value = "   ";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_currency_with_specified_name_already_exists: function(recordResults) {
        this._currenciesManager.getCurrencyByNameResult = {id: 2};
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_empty_symbol_is_specified: function(recordResults) {
        this._currencyData.symbol.value = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("symbol", key));
        });
    },

    test_validation_should_fail_when_empty_rate_is_specified: function(recordResults) {
        this._currencyData.rate.value = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_fail_when_non_numeric_rate_is_specified: function(recordResults) {
        this._currencyData.rate.value = "qwerty";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_fail_when_zero_rate_is_specified: function(recordResults) {
        this._currencyData.rate.value = "0.0";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_rate_validation_should_be_stopped_when_empty_rate_is_found: function(recordResults) {
        this.errorCallbackCalledCount = 0;
        this._currencyData.rate.value = "";

        this._validator.validate(this._currencyData, Prototype.emptyFunction, (function(key, message) {
            this.errorCallbackCalledCount++;
        }).bind(this));

        Mojo.requireEqual(1, this.errorCallbackCalledCount);

        return Mojo.Test.passed;
    },

    test_validation_should_be_succeeded_when_currency_with_specified_name_does_not_exist: function(recordResults) {
        this._currenciesManager.getCurrencyByNameResult = null;
        this._validator.validate(this._currencyData, recordResults, Prototype.emptyFunction);
    },

    test_validation_should_be_succeeded_when_currency_was_editing_and_name_was_not_changed: function(recordResults) {
        this._currenciesManager.getCurrencyByNameResult = {id: 1};
        this._validator.validate(this._currencyData, recordResults, function(key, message) {
            recordResults("Validation should pass for '" + key + "' field: " + message);
        });
    },

    test_validation_should_be_succeeded_when_currency_editing_and_name_was_not_changed: function(recordResults) {
        this._validator.validate(this._currencyData, recordResults, Prototype.emptyFunction);
    },

    test_validation_should_not_request_currency_with_manager_when_empty_name_specified: function() {
        this._currencyData.name.value = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, Prototype.emptyFunction);

        Mojo.requireEqual(0, this._currenciesManager.getCurrencyByNameInvokedCount);
        return Mojo.Test.passed;
    }
});