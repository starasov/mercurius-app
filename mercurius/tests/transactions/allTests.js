Transactions.AllTests = function() {
    return [
        {
            title: "Transactions.MapperTest",
            source: "tests/transactions/mapperTest.js",
            test: Transactions.MapperTest
        },

        {
            title: "Transactions.ValidatorTest",
            source: "tests/transactions/validatorTest.js",
            test: Transactions.ValidatorTest
        }
    ];
};