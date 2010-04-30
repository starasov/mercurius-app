Currencies.Validator = Class.create(Models.GenericValidator, {
    initialize: function($super, fields, currenciesManager) {
        $super(fields);
        Mojo.require(currenciesManager, "Passed 'currenciesManager' can't be null.");
        this.currenciesManager = currenciesManager;
    },

    _validateName: function(name, successCallback, errorCallback) {
        if (!name || name.trim().length == 0) {
            errorCallback("name", "Currency name should be defined.");
        }

        this.currenciesManager.getCurrencyByName(name, function(transaction, currency) {
            if (currency != null) {
                errorCallback("name", "Currency with specified name already exists.");
            } else {
                successCallback();                
            }
        }, function(transaction, error) {
            errorCallback("_all", "Failed to read currencies data.");
        });
    }
});