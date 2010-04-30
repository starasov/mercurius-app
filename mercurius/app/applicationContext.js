ApplicationContext = Class.create({
    initialize: function(databaseService, currenciesFactory) {
        this.databaseService = databaseService;
        this.currenciesFactory = currenciesFactory;
    },

    getDatabase: function(successCallback, errorCallback) {
        this.databaseService.getDatabase(successCallback, errorCallback);
    },

    getCurrenciesFactory: function() {
        return this.currenciesFactory;
    }
});