Models.GenericValidator = Class.create({
    initialize: function(fields) {
        Mojo.require(fields, "Passed 'fields' parameter can't be null or undefined.");
        this.fields = fields;
    },

    validate: function(formData, successCallback, errorCallback) {
        Mojo.require(formData, "Passed 'formData' parameter can't be null or undefined.");
        Mojo.requireFunction(successCallback, "Passed 'successCallback' should be a function.");
        Mojo.requireFunction(errorCallback, "Passed 'errorCallback' should be a function.");

        var asyncChain = new Utils.AsyncChain(successCallback, errorCallback);

        this._addFieldsValidationToChain(asyncChain, formData);
        this._addFormValidationToChain(asyncChain, formData);

        Mojo.require(asyncChain.isNotEmpty(), "At least one validation method required.");
        asyncChain.call();
    },

    _addFieldsValidationToChain: function(asyncChain, modelData) {
        for (var fieldName in this.fields) {
            var functionName = "_validate" + fieldName.capitalize();
            var fieldValidationFunction = this[functionName];
            if (fieldValidationFunction) {
                asyncChain.add(fieldValidationFunction.bind(this, modelData[fieldName], this.fields[fieldName]));
            }
        }
    },

    _addFormValidationToChain: function(asyncChain, modelData) {
        var validationFunction = this["_validate"];
        if (validationFunction) {
            asyncChain.add(validationFunction.bind(this, modelData));
        }
    }
});