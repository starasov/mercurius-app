Database.AllTests = function() {
    return [
        {
            title: "Database.InitializerTest",
            source: "tests/database/initializerTest.js",
            test: Database.InitializerTest
        },
            
        {
            title: "Database.ServiceIntegrationTest",
            source: "tests/database/serviceIntegrationTest.js",
            test: Database.ServiceIntegrationTest
        },

        {
            title: "Database.TransactionTest",
            source: "tests/database/transactionTest.js",
            test: Database.TransactionTest
        },

        {
            title: "Database.VersionProviderTest",
            source: "tests/database/versionProviderTest.js",
            test: Database.VersionProviderTest
        }
    ];
};