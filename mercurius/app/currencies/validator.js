Currencies.Validator = Class.create(Models.GenericValidator, {
    initialize: function($super, fields, currenciesManager, newCurrencyFlag) {
        Mojo.require(currenciesManager, "Passed 'currenciesManager' can't be null.");

        $super(fields);

        this.currenciesManager = currenciesManager;
        this.newCurrencyFlag = newCurrencyFlag;
    },

    _validateName: function(name, fieldModel, successCallback, errorCallback) {
        if (!Models.ValidationUtils.validateNotEmpty(name)) {
            errorCallback("name", "Currency name can't be empty.");
        } else if (this.newCurrencyFlag) {
            this.currenciesManager.getCurrencyByName(name, function(transaction, currency) {
                if (currency != null) {
                    errorCallback("name", "Currency with specified name already exists.");
                } else {
                    successCallback();
                }
            }, function(transaction, error) {
                errorCallback("_all", "Failed to read currencies data.");
            });
        } else {
            successCallback();            
        }
    },

    _validateSymbol: function(symbol, fieldModel, successCallback, errorCallback) {
        if (!Models.ValidationUtils.validateNotEmpty(symbol)) {
            errorCallback("symbol", "Currency symbol can't be empty.");
        } else {
            successCallback();
        }
    },

    _validateRate: function(rateData, fieldModel, successCallback, errorCallback) {
        if (!Models.ValidationUtils.validateNotEmpty(rateData)) {
            errorCallback("rate", "Currency exchange rate can't be empty.");
        }

        var rate = fieldModel.fromFormData(rateData);
        if (rate > 0.0) {
            successCallback();
        } else {
            errorCallback("rate", "Rate should be positive number.")
        }
    }
});