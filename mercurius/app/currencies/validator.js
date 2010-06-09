
// ToDO :1:  Add extra unit test for validate rate method to avoid repetitive error callback calls.

Currencies.Validator = Class.create(Models.GenericValidator, {
    initialize: function($super, fields, currenciesManager, newCurrencyFlag) {
        Mojo.require(currenciesManager, "Passed 'currenciesManager' can't be null.");

        $super(fields);

        this.currenciesManager = currenciesManager;
        this.newCurrencyFlag = newCurrencyFlag;
    },

    _validateName: function(nameFieldModel, fieldDescriptor, successCallback, errorCallback) {
        var name = fieldDescriptor.fromFieldModel(nameFieldModel);
        
        if (!Models.ValidationUtils.validateNotEmpty(name)) {
            errorCallback("name", "Currency name can't be empty.");
        } else if (this.newCurrencyFlag) {
            this.currenciesManager.getCurrencyByName(name, function(currency) {
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

    _validateSymbol: function(symbolFieldModel, fieldDescriptor, successCallback, errorCallback) {
        var symbol = fieldDescriptor.fromFieldModel(symbolFieldModel);

        if (!Models.ValidationUtils.validateNotEmpty(symbol)) {
            errorCallback("symbol", "Currency symbol can't be empty.");
        } else {
            successCallback();
        }
    },

    _validateRate: function(rateFieldModel, fieldDescriptor, successCallback, errorCallback) {
        if (!Models.ValidationUtils.validateNotEmpty(rateFieldModel.value)) {
            errorCallback("rate", "Currency exchange rate can't be empty.");
            return;
        }

        var rate = fieldDescriptor.fromFieldModel(rateFieldModel);
        if (rate > 0.0) {
            successCallback();
        } else {
            errorCallback("rate", "Rate should be positive number.")
        }
    }
});