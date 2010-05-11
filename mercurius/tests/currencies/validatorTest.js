Currencies.ValidatorTest = Class.create({
    before: function() {
        this._currenciesManager = new Currencies.MockManager();
        this._validator = new Currencies.Validator(Currencies.Fields, this._currenciesManager, true);
        this._currencyData = {name: "USD", symbol: "$", rate: "1.0"};

        return Mojo.Test.beforeFinished;
    },

    test_validation_should_fail_when_empty_name_is_specified: function(recordResults) {
        this._currencyData.name = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_whitespace_name_is_specified: function(recordResults) {
        this._currencyData.name = "   ";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_currency_with_specified_name_already_exists: function(recordResults) {
        this._currenciesManager.getCurrencyByNameResult = this._currencyData;
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_empty_symbol_is_specified: function(recordResults) {
        this._currencyData.symbol = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("symbol", key));
        });
    },

    test_validation_should_fail_when_empty_rate_is_specified: function(recordResults) {
        this._currencyData.rate = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_fail_when_non_numeric_rate_is_specified: function(recordResults) {
        this._currencyData.rate = "qwerty";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_fail_when_zero_rate_is_specified: function(recordResults) {
        this._currencyData.rate = "0.0";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("rate", key));
        });
    },

    test_validation_should_be_succeeded_when_currency_with_specified_name_does_not_exist: function(recordResults) {
        this._currenciesManager.getCurrencyByNameResult = this._currencyData;
        this._validator.newCurrencyFlag = false;
        this._validator.validate(this._currencyData, recordResults, Prototype.emptyFunction);
    },

    test_validation_should_be_succeeded_when_currency_editing_and_name_was_not_changed: function(recordResults) {
        this._validator.validate(this._currencyData, recordResults, Prototype.emptyFunction);
    },

    test_validation_should_not_request_currency_with_manager_when_empty_name_specified: function() {
        this._currencyData.name = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, Prototype.emptyFunction);

        Mojo.requireEqual(0, this._currenciesManager.getCurrencyByNameInvokedCount);
        return Mojo.Test.passed;
    }
});