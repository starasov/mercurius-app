Models.FieldsTest = Class.create({
    test_text_field_should_have_correct_default_max_length_property: function() {
        var textField = Models.Fields.createTextField("id", "Text", "text");
        Mojo.requireEqual(20, textField.attributes.maxLength);
        return Mojo.Test.passed;
    },

    test_text_field_should_have_correct_max_length_property: function() {
        var textField = Models.Fields.createTextField("id", "Text", "text", 22);
        Mojo.requireEqual(22, textField.attributes.maxLength);
        return Mojo.Test.passed;
    },

    test_decimal_field_should_create_string_for_number_when_default_fraction_digits_used: function() {
        var decimalField = Models.Fields.createDecimalField("id", "Text", "text");
        Mojo.requireEqual("10.00", decimalField.toFormData(10));
        return Mojo.Test.passed;
    },

    test_decimal_field_should_create_string_for_number_when_fraction_digits_passed: function() {
        var decimalField = Models.Fields.createDecimalField("id", "Text", "text", 3);
        Mojo.requireEqual("10.000", decimalField.toFormData(10));
        return Mojo.Test.passed;
    }
});