Models.FieldsTest = Class.create({
    test_text_field_should_have_correct_default_max_length_property: function() {
        var textField = Models.Fields.createTextField("id", "Text");
        Mojo.requireEqual(20, textField.attributes.maxLength);
        return Mojo.Test.passed;
    },

    test_text_field_should_have_correct_max_length_property: function() {
        var textField = Models.Fields.createTextField("id", "Text", 22);
        Mojo.requireEqual(22, textField.attributes.maxLength);
        return Mojo.Test.passed;
    },

    test_decimal_field_should_create_string_for_number_when_default_fraction_digits_used: function() {
        var decimalField = Models.Fields.createDecimalField("id", "Text");
        Mojo.requireEqual("10.00", decimalField.toFieldModel(10).value);
        return Mojo.Test.passed;
    },

    test_decimal_field_should_create_string_for_number_when_fraction_digits_passed: function() {
        var decimalField = Models.Fields.createDecimalField("id", "Text", 3);
        Mojo.requireEqual("10.000", decimalField.toFieldModel(10).value);
        return Mojo.Test.passed;
    },

    test_decimal_field_should_correctly_create_model_for_zero_value: function() {
        var decimalField = Models.Fields.createDecimalField("id", "Text");
        var fieldModel = decimalField.toFieldModel(0);
        Mojo.requireEqual("0.00", fieldModel.value);
        return Mojo.Test.passed;
    },

    test_currency_field_should_correctly_create_model_from_passed_cents_number: function() {
        var currencyField = Models.Fields.createCurrencyField("id", "Text");
        Mojo.requireEqual("1.00", currencyField.toFieldModel(100).value);
        return Mojo.Test.passed;
    },

    test_currency_field_should_correctly_create_value_from_passed_dollars_number: function() {
        var currencyField = Models.Fields.createCurrencyField("id", "Text");
        Mojo.requireEqual(10000, currencyField.fromFieldModel({value: "100.0"}));
        return Mojo.Test.passed;
    },

    test_currency_field_should_correctly_create_view_string_when_no_currency_symbol_passed: function() {
        var currencyField = Models.Fields.createCurrencyField("id", "Text");
        Mojo.requireEqual("1.00", currencyField.toViewString(100));
        return Mojo.Test.passed;
    }
});