Utils.JsonResourceReader = Class.create({
    read: function(resourcePath) {
        Mojo.requireString(resourcePath, "Passed 'resourcePath' should be a string.");

        var jsonText = palmGetResource(resourcePath);
        return Mojo.parseJSON(jsonText);
    }
});