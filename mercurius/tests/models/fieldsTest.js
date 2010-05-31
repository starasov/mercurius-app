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
    }
});