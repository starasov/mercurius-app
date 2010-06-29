Currencies.ManagerHomeCurrencyIntergrationTest = Class.create(Currencies.BaseManagerIntegrationTest, {
    test_should_return_home_currency_instance_when_exists: function(recordResults) {
        this._currenciesManager.getHomeCurrency(function(currency) {
            Test.validateAndContinue(recordResults, Mojo.require.curry(currency));
            Test.validate(recordResults, Mojo.requireEqual.curry(1, currency.id));
        }, Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_return_null_when_no_home_currency_exists: function(recordResults) {
        this._currenciesManager.deleteById(1, (function(/*count*/) {
            this._currenciesManager.getHomeCurrency(function(currency) {
                Test.validate(recordResults, Mojo.requireEqual.curry(null, currency));
            }, Test.defaultDatabaseErrorCallback.curry(recordResults));
        }).bind(this), Test.defaultDatabaseErrorCallback.curry(recordResults));
    },

    test_should_update_new_home_currency_flag_when_valid_currency_id_passed: function(recordResults) {
        this._currenciesManager.setHomeCurrency(2, function(new_home_currency) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(2, new_home_currency.id));
            Test.validate(recordResults, Mojo.requireEqual.curry(true, new_home_currency.home_flag));
        }, Test.databaseErrorHandler(recordResults));
    },

    test_should_update_new_home_currency_rate_when_valid_currency_id_passed: function(recordResults) {
        this._currenciesManager.setHomeCurrency(2, function(new_home_currency) {
            Test.validate(recordResults, Test.requireNumbersEqual.curry(1.0, new_home_currency.rate));
        }, Test.databaseErrorHandler(recordResults));
    },

    test_should_update_old_home_currency_flag_when_valid_currency_id_passed: function(recordResults) {
        this._currenciesManager.setHomeCurrency(2, (function(/*new_home_currency*/) {
            this._currenciesManager.findById(1, (function(currency) {
                Test.validate(recordResults, Mojo.requireEqual.curry(false, currency.home_flag));
            }).bind(this), Test.databaseErrorHandler(recordResults))
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_should_fail_when_non_existing_currency_passed: function(recordResults) {
        this._currenciesManager.setHomeCurrency(0, Prototype.emptyFunction, function(transaction, error) {
            recordResults();
        });
    }
});