Currencies.ValidatorTest = Class.create({
    before: function() {
        this._currenciesManager = new Currencies.MockManager();
        this._validator = new Currencies.Validator(Currencies.Fields, this._currenciesManager);
        this._currencyData = {name: "USD", symbol: "$", rate: "1.0"};

        return Mojo.Test.beforeFinished;
    },

    test_validation_should_fail_when_empty_name_is_specified: function(recordResults) {
        this._currencyData.name = "";
        this._validator.validate(this._currencyData, Prototype.emptyFunction, function(key, message) {
            Test.validate(recordResults, Mojo.requireEqual.curry("name", key));
        });
    },

    test_validation_should_fail_when_whitespaces_name_is_specified: function(recordResults) {
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

    test_validation_should_be_succeeded_when_currency_with_specified_name_does_not_exist: function(recordResults) {
        this._validator.validate(this._currencyData, recordResults, Prototype.emptyFunction);
    }
});