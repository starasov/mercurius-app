Currencies.Validator = Class.create(Validation.GenericValidator, {
    initialize: function($super, fields, currenciesManager, currencyId) {
        Mojo.require(currenciesManager, "Passed 'currenciesManager' can't be null.");

        $super(fields);

        this.currenciesManager = currenciesManager;
        this.currencyId = currencyId;
    },

    _validateName: function(nameFieldModel, fieldDescriptor, successCallback, errorCallback) {
        var name = fieldDescriptor.fromFieldModel(nameFieldModel);
        
        if (!Validation.Utils.validateNotEmpty(name)) {
            errorCallback("name", "Currency name can't be empty.");
        } else {
            this.currenciesManager.getCurrencyByName(name, (function(currency) {
                if (currency && currency.id != this.currencyId) {
                    errorCallback("name", "Currency with specified name already exists.");
                } else {
                    successCallback();
                }
            }).bind(this), function(transaction, error) {
                errorCallback("_all", "Failed to read currencies data.");
            });
        }
    },

    _validateSymbol: function(symbolFieldModel, fieldDescriptor, successCallback, errorCallback) {
        var symbol = fieldDescriptor.fromFieldModel(symbolFieldModel);

        if (!Validation.Utils.validateNotEmpty(symbol)) {
            errorCallback("symbol", "Currency symbol can't be empty.");
        } else {
            successCallback();
        }
    },

    _validateRate: function(rateFieldModel, fieldDescriptor, successCallback, errorCallback) {
        if (!Validation.Utils.validateNotEmpty(rateFieldModel.value)) {
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