Utils.ParseIntegerTest = Class.create({
    test_should_correctly_parse_integer_number_string: function() {
        Mojo.requireEqual(123, Utils.Parsing.parseInteger("123"));
        return Mojo.Test.passed;
    },

    test_should_return_nan_when_empty_string_passed: function() {
        Mojo.requireEqual(123, Utils.Parsing.parseInteger(""));
        return Mojo.Test.passed;
    }
});
