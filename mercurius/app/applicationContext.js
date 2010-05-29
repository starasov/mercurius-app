ApplicationContext = Class.create({
    initialize: function(databaseService, currenciesFactory, accountsFactory) {
        this.databaseService = databaseService;
        this.currenciesFactory = currenciesFactory;
        this.accountsFactory = accountsFactory
    },

    getDatabase: function(successCallback, errorCallback) {
        this.databaseService.getDatabase(successCallback, errorCallback);
    },

    getCurrenciesFactory: function() {
        return this.currenciesFactory;
    },

    getAccountsFactory: function() {
        return this.accountsFactory;
    }
});
