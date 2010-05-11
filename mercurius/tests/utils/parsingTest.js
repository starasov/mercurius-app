Utils.ParsingTest = Class.create({
    test_should_correctly_parse_integer_number_string: function() {
        Test.requireNumbersEqual(123, Utils.Parsing.parseNumber("123"));
        return Mojo.Test.passed;
    },

    test_should_correctly_parse_integer_number_string_with_thousands_spacers: function() {
        Test.requireNumbersEqual(123000000, Utils.Parsing.parseNumber("123,000,000"));
        return Mojo.Test.passed;
    },

    test_should_correctly_parse_number_string_with_decimal_separator: function() {
        Test.requireNumbersEqual(123.03, Utils.Parsing.parseNumber("123.03"));
        return Mojo.Test.passed;
    },

    test_should_correctly_parse_number_string_with_thousands_spacers_and_decimal_separator: function() {
        Test.requireNumbersEqual(123000.03, Utils.Parsing.parseNumber("123,000.03"));
        return Mojo.Test.passed;
    }
});