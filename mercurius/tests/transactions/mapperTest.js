Transactions.MapperTest = Class.create(Database.BaseMapperTest, {
    test_findForAccount_should_return_expected_transactions_number: function(recordResults) {
        this.mapper.findForAccount(1, Database.NO_LIMIT, 0, (function(transactions) {
            Test.validate(recordResults, Mojo.requireEqual.curry(3, transactions.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    test_findForAccount_should_return_empty_list_when_no_transactions_exist: function(recordResults) {
        this.mapper.findForAccount(0, Database.NO_LIMIT, 0, (function(transactions) {
            Test.validate(recordResults, Mojo.requireEqual.curry(0, transactions.length));
        }).bind(this), Test.databaseErrorHandler(recordResults));
    },

    getFixtures: function() {
        return [
            Mojo.appPath + "resources/database/accounts.json",
            Mojo.appPath + "resources/database/accounts_initial.json",
            Mojo.appPath + "resources/database/currencies.json",
            Mojo.appPath + "resources/database/categories.json",
            Mojo.appPath + "resources/database/transactions.json"
        ];
    },

    createMapper: function(db) {
        return new Transactions.Mapper(db);
    },

    getInitialCount: function() {
        return 4;
    },

    createNewModel: function() {
        return {
            amount: 10000,
            date: (new Date()).getTime(),
            account_id: 1,
            category_id: 1
        };
    },

    createUpdateModel: function() {
        var model = this.createNewModel();
        model.id = 1;

        return model;
    }
});