Models.CurrenciesManagerHomeCurrencyIntergrationTest = Class.create(Models.BaseGenericManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
            var factory = new Models.Currencies.ManagerFactory();
            this._currenciesManager = factory.create(this._service.getDatabase());
            completionCallback();
        }).bind(this));
    },

    getTableModel: function() {
        return Models.Currencies.TableModel;
    },

    getFixtures: function($super, tableModel) {
        return $super(tableModel).concat([
                "INSERT INTO currencies VALUES(1, 'US Dollar', '$', 1.0, 1);",
                "INSERT INTO currencies VALUES(2, 'Euro', 'EUR', 1.2, 0);",
                "INSERT INTO currencies VALUES(3, 'GB Pound', 'GPB', 1.4, 0);"
        ]);
    },

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