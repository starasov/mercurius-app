Models.ValidationUtils = {
    validateNotEmpty: function(value) {
        return !Utils.Parsing.isEmptyString(value);
    }
};