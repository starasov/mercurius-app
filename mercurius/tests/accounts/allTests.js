Accounts.AllTests = function() {
    return [
        {
            title: "Accounts.MapperTest",
            source: "tests/accounts/mapperTest.js",
            test: Accounts.MapperTest
        },

        {
            title: "Accounts.ValidatorTest",
            source: "tests/accounts/validatorTest.js",
            test: Accounts.ValidatorTest
        }
    ];
};