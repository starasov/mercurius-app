Utils.JsonResourceReaderIntegrationTest = Class.create({
    test_should_read_and_convert_to_json_when_existing_resource_requested: function() {
        var reader = new Utils.JsonResourceReader();
        var testData = reader.read(Mojo.appPath + "tests/resources/data/test.json");

        Mojo.require(testData.some);
        Test.requireArraysEqual(["json", "data", "there"], testData.some);

        return Mojo.Test.passed;
    },

    test_should_raise_exception_when_resource_does_not_exist: function(recordResults) {
        var reader = new Utils.JsonResourceReader();

        try {
            reader.read(Mojo.appPath + "not/exists/file.json");
            recordResults("Should raise an error when non existing path specified.");
        } catch(e) {
            recordResults();
        }
    }
});