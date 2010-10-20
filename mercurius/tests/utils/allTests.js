Utils.AllTests = function() {
    return [
        {
            title: "Utils.AsyncChainTest",
            source: "tests/utils/asyncChainTest.js",
            test: Utils.AsyncChainTest
        },

        {
            title: "Utils.JsonResourceReaderIntegrationTest",
            source: "tests/utils/jsonResourceReaderIntegrationTest.js",
            test: Utils.JsonResourceReaderIntegrationTest
        },

        {
            title: "Utils.ParseDecimalTest",
            source: "tests/utils/parseDecimalTest.js",
            test: Utils.ParseDecimalTest
        }
    ];
};