Accounts.ManagerFindIntegrationTest = Class.create(Models.BaseManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
            var currenciesManager = new Currencies.Factory().createManager(this._db);
            this._accountsManager = new Accounts.Factory(currenciesManager).createManager(this._db);
            completionCallback();
        }).bind(this));
    },

    getTableModels: function() {
        return [Currencies.TableModel, Accounts.TableModel];
    },

    getFixtures: function() {
        return [
            "INSERT INTO currencies VALUES(1, 'US Dollar', '$', 1.0, 1);",
            "INSERT INTO currencies VALUES(2, 'Euro', 'EUR', 1.2, 0);",
            "INSERT INTO currencies VALUES(3, 'GB Pound', 'GPB', 1.4, 0);",
            "INSERT INTO accounts VALUES(1, 'Cash', 100.0, 1, 0);",
            "INSERT INTO accounts VALUES(2, 'VISA USD', 2000.0, 1, 0);"
        ];
    },

    test_should_correctly_load_account_with_currency_when_exists: function(recordResults) {
        this._accountsManager.findById(1, function(account) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(1, account.currency.id));
            Test.validate(recordResults, Mojo.requireEqual.curry("US Dollar", account.currency.name));
        }, recordResults);
    }
});