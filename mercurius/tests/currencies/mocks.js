Currencies.MockManager = Class.create({
    initialize: function() {
        this.getCurrencyByNameResult = null;
        this.getCurrencyByNameInvokedCount = 0;
    },

    getCurrencyByName: function(name, successCallback, errorCallback) {
        this.getCurrencyByNameInvokedCount++;
        successCallback(this.getCurrencyByNameResult);
    }
});