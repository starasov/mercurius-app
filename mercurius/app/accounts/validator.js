Accounts.Validator = Class.create(Models.GenericValidator, {
    log: Mojo.Log,

    _validateName: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        this.log.info("[_validateName]: %j", fieldModel);
        
        var name = fieldDescriptor.fromFieldModel(fieldModel);
        if (!Models.ValidationUtils.validateNotEmpty(name)) {
            errorCallback("name", "Account name can't be empty.");
        }
        else {
            successCallback();
        }
    },

    _validateOpeningBalance: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        if (!Models.ValidationUtils.validateNotEmpty(fieldModel.value)) {
            errorCallback("opening_balance", "Opening Balance can't be empty.");
            return;
        }

        var openingBalance = fieldDescriptor.fromFieldModel(fieldModel);
        if (isNaN(openingBalance) || (openingBalance < 0.0)) {
            errorCallback("opening_balance", "Opening Balance should be non negative number.");
        } else {
            successCallback();
        }

    },

    _validateCurrencyId: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        this.log.info("[_validateCurrencyId]: %j", fieldModel);

        var currencyId = fieldDescriptor.fromFieldModel(fieldModel);
        if (isNaN(currencyId) || currencyId == 0) {
            errorCallback("currency", "Currency should be assigned to the account.");
        } else {
            successCallback();
        }
    }
});