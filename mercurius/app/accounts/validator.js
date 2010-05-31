Accounts.Validator = Class.create(Models.GenericValidator, {
    _validateName: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        var name = fieldDescriptor.fromFieldModel(fieldModel);
        if (!Models.ValidationUtils.validateNotEmpty(name)) {
            errorCallback("name", "Account name can't be empty.");
        }

        successCallback();
    },

    _validateOpeningBalance: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        if (!Models.ValidationUtils.validateNotEmpty(fieldModel.value)) {
            errorCallback("opening_balance", "Opening Balance can't be empty.");
        }

        var openingBalance = fieldDescriptor.fromFieldModel(fieldModel);
        if (isNaN(openingBalance)) {
            errorCallback("opening_balance", "Opening Balance should be a valid number.");
        }

        successCallback();
    },

    _validateCurrencyId: function(rateFieldModel, fieldDescriptor, successCallback, errorCallback) {
        if (!Object.isNumber(rateFieldModel.value) || rateFieldModel.value == 0) {
            errorCallback("rate", "Currency should be assigned to the account.");
        }

        successCallback();
    }
});