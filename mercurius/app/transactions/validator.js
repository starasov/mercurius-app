Transactions.Validator = Class.create(Validation.GenericValidator, {
    log: Utils.NullLog,

    _validateAccountId: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        var accountId = fieldDescriptor.fromFieldModel(fieldModel);
        if (isNaN(accountId) || accountId == 0) {
            errorCallback("account", "Please specify transaction account.");
        } else {
            successCallback();
        }
    },

    _validateAmount: function(fieldModel, fieldDescriptor, successCallback, errorCallback) {
        if (!Validation.Utils.validateNotEmpty(fieldModel.value)) {
            errorCallback("amount", "Amount can't be empty.");
            return;
        }

        var amount = fieldDescriptor.fromFieldModel(fieldModel);
        if (isNaN(amount)) {
            errorCallback("amount", "Amount should be a number.");
        } else {
            successCallback();
        }
    }
});