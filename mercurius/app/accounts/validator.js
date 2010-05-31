Accounts.Validator = Class.create(Models.GenericValidator, {
    _validateName: function(nameFieldModel, fieldDescriptor, successCallback, errorCallback) {
        var name = fieldDescriptor.fromFieldModel(nameFieldModel);

        if (!Models.ValidationUtils.validateNotEmpty(name)) {
            errorCallback("name", "Currency name can't be empty.");
        } else {
            successCallback();
        }
    },

    _validateOpeningBalance: function(symbolFieldModel, fieldDescriptor, successCallback, errorCallback) {
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
        }

        var rate = fieldDescriptor.fromFieldModel(rateFieldModel);
        if (rate > 0.0) {
            successCallback();
        } else {
            errorCallback("rate", "Rate should be positive number.")
        }
    }
});