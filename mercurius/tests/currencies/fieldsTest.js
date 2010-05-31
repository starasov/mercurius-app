Currencies.FieldsTest = Class.create({
    test_rate_from_form_data_should_correctly_parse_localized_decimal_formatting: function() {
        var formattedRate = Currencies.Fields.rate.toFieldModel(123456789).value;
        var parsedRate = Currencies.Fields.rate.fromFieldModel({value: formattedRate});

        Test.requireNumbersEqual(123456789, parsedRate);
        return Mojo.Test.passed;
    }
});