Currencies.ManagerHomeCurrencyIntergrationTest = Class.create(Currencies.BaseManagerIntegrationTest, {
    test_should_return_home_currency_instance_when_exists: function(recordResults) {
        this._currenciesManager.getHomeCurrency(function(transaction, currency) {
            Test.validateAndContinue(recordResults, Mojo.require.curry(currency));
            Test.validate(recordResults, Mojo.requireEqual.curry(1, currency.id));
        }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_return_null_when_no_home_currency_exists: function(recordResults) {
        this._currenciesManager.deleteById(1, (function(transaction, resultSet) {
            this._currenciesManager.getHomeCurrency(function(transaction, currency) {
                Test.validate(recordResults, Mojo.requireEqual.curry(null, currency));
            }, Test.defaultDatabaseErrorCallback.curry(recordResults));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    }
});