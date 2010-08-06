ApplicationContext = Class.create({
    initialize: function(databaseService, currenciesFactory, accountsFactory, categoriesFactory, transactionsFactory) {
        this.databaseService = databaseService;
        this.currenciesFactory = currenciesFactory;
        this.accountsFactory = accountsFactory;
        this.categoriesFactory = categoriesFactory;
        this.transactionsFactory = transactionsFactory;
    },

    getDatabase: function(successCallback, errorCallback) {
        this.databaseService.getDatabase(successCallback, errorCallback);
    },

    getCurrenciesFactory: function() {
        return this.currenciesFactory;
    },

    getAccountsFactory: function() {
        return this.accountsFactory;
    },

    getCategoriesFactory: function() {
        return this.categoriesFactory;
    },

    getTransactionsFactory: function() {
        return this.transactionsFactory;
    }
});
