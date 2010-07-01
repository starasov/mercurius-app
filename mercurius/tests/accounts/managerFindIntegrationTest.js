Accounts.ManagerFindIntegrationTest = Class.create(Models.BaseManagerIntegrationTest, {
    before: function($super, completionCallback) {
        $super((function() {
            this._accountsManager = new Accounts.Factory(new Currencies.Factory()).createManager(this._db);
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
            "INSERT INTO accounts VALUES(2, 'VISA USD', 2000.0, 1, 0);",
            "INSERT INTO accounts VALUES(3, 'VISA DEPO USD', 0.0, 1, 1);"
        ];
    },

    test_should_correctly_load_account_with_currency_when_exists: function(recordResults) {
        this._accountsManager.findById(1, function(account) {
            Test.validateAndContinue(recordResults, Mojo.requireEqual.curry(1, account.currency.id));
            Test.validate(recordResults, Mojo.requireEqual.curry("US Dollar", account.currency.name));
        }, recordResults);
    },

    test_find_open_accounts_should_correctly_filter_opened_accounts_when_found: function(recordResults) {
        this._accountsManager.findOpenAccounts({}, function(accounts) {
            Test.validate(recordResults, Mojo.requireEqual.curry(2, accounts.length));
        }, recordResults)
    },

    test_find_open_accounts_should_return_empty_list_when_no_open_accounts_found: function(recordResults) {
        this.executeStatements(["DELETE FROM accounts WHERE id=1 OR id=2;"], (function() {
            this._accountsManager.findOpenAccounts({}, function(accounts) {
                Test.validate(recordResults, Mojo.requireEqual.curry(0, accounts.length));
            }, recordResults)
        }).bind(this), recordResults);
    }
});