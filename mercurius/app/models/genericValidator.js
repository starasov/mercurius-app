Models.GenericValidator = Class.create({
    initialize: function(fields) {
        Mojo.require(fields, "Passed 'fields' parameter can't be null or undefined.");
        this.fields = fields;
    },

    validate: function(formFields, successCallback, errorCallback) {
        Mojo.require(formFields, "Passed 'formFields' parameter can't be null or undefined.");
        Mojo.requireFunction(successCallback, "Passed 'successCallback' should be a function.");
        Mojo.requireFunction(errorCallback, "Passed 'errorCallback' should be a function.");

        var asyncChain = new Utils.AsyncChain(successCallback, errorCallback);

        this._addFieldsValidationToChain(asyncChain, formFields);
        this._addFormValidationToChain(asyncChain, formFields);

        Mojo.require(asyncChain.isNotEmpty(), "At least one validation method required.");
        asyncChain.call();
    },

    _addFieldsValidationToChain: function(asyncChain, formFields) {
        for (var fieldName in this.fields) {
            var functionName = this._getFieldValidationFunctionName(fieldName);
            var fieldValidationFunction = this[functionName];
            if (fieldValidationFunction) {
                asyncChain.add(fieldValidationFunction.bind(this, formFields[fieldName], this.fields[fieldName]));
            }
        }
    },

    _addFormValidationToChain: function(asyncChain, formFields) {
        var validationFunction = this["_validate"];
        if (validationFunction) {
            asyncChain.add(validationFunction.bind(this, formFields));
        }
    },

    _getFieldValidationFunctionName: function(fieldName) {
        var fieldNameWords = fieldName.split("_");

        var functionName = "_validate";
        for (var i = 0; i < fieldNameWords.length; i++) {
            functionName += fieldNameWords[i].capitalize();
        }

        return functionName;
    }
});