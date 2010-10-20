Currencies.AllTests = function() {
    return [
        {
            title: "Currencies.FieldsTest",
            source: "tests/currencies/fieldsTest.js",
            test: Currencies.FieldsTest
        },

        {
            title: "Currencies.MapperTest",
            source: "tests/currencies/mapperTest.js",
            test: Currencies.MapperTest
        },

        {
            title: "Currencies.ValidatorTest",
            source: "tests/currencies/validatorTest.js",
            test: Currencies.ValidatorTest
        }
    ];
};