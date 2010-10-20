Accounts.MapperTest = Class.create(Database.BaseMapperTest, {
    test_findAllWithBalance_should_return_expected_accounts_number: function(recordResults) {
        this.mapper.findAllWithBalance(Database.NO_LIMIT, 0, (function(accounts) {
            Test.validate(recordResults, Mojo.requireEqual.curry(3, accounts.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findAllWithBalance_should_return_correct_account_transactions_balance: function(recordResults) {
        this.mapper.findAllWithBalance(Database.NO_LIMIT, 0, (function(accounts) {
            Test.validate(recordResults, Mojo.requireEqual.curry(-1500, accounts[0].transactions_balance));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findAllWithBalance_should_return_correct_account_balance: function(recordResults) {
        this.mapper.findAllWithBalance(Database.NO_LIMIT, 0, (function(accounts) {
            Test.validate(recordResults, Mojo.requireEqual.curry(8500, accounts[0].balance));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findOpenWithBalance_should_return_expected_accounts_number: function(recordResults) {
        this.mapper.findOpenWithBalance(Database.NO_LIMIT, 0, (function(accounts) {
            Test.validate(recordResults, Mojo.requireEqual.curry(2, accounts.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    getFixtures: function() {
        return [
            Mojo.appPath + "resources/database/accounts.json",
            Mojo.appPath + "resources/database/accounts_initial.json",
            Mojo.appPath + "resources/database/currencies.json",
            Mojo.appPath + "resources/database/transactions.json"
        ];
    },

    createMapper: function(db) {
        return new Accounts.Mapper(db);
    },

    getInitialCount: function() {
        return 3;
    },

    createNewModel: function() {
        return {
            name: "Savings",
            opening_balance: 10000,
            currency_id: 1,
            closed_flag: false
        };
    },

    createUpdateModel: function() {
        var model = this.createNewModel();
        model.id = 1;

        return model;
    }
});