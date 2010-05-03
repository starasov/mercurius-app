Models.ValidationUtilsTest = Class.create({
    test_validate_not_empty_should_fail_when_null_is_passed: function() {
        Mojo.requireFalse(Models.ValidationUtils.validateNotEmpty(null));
        return Mojo.Test.passed;
    },

    test_validate_not_empty_should_fail_when_whitespace_string_is_passed: function() {
        Mojo.requireFalse(Models.ValidationUtils.validateNotEmpty("  "));
        return Mojo.Test.passed;
    },

    test_validate_not_empty_should_be_success_when_string_is_passed: function() {
        Mojo.require(Models.ValidationUtils.validateNotEmpty("A"));
        return Mojo.Test.passed;
    }
});