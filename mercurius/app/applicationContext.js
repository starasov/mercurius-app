ApplicationContext = Class.create({
    initialize: function(databaseService, currenciesFactory, accountsFactory, categoriesFactory) {
        this.databaseService = databaseService;
        this.currenciesFactory = currenciesFactory;
        this.accountsFactory = accountsFactory;
        this.categoriesFactory = categoriesFactory;
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
    }
});
