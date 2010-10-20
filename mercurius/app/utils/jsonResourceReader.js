Utils.JsonResourceReader = Class.create({
    read: function(resourcePath) {
        Mojo.requireString(resourcePath, "Passed 'resourcePath' should be a string.");

        var jsonText = palmGetResource(resourcePath);
        if (jsonText == null) {
            throw new Error("Specified resource '" + resourcePath + "' path does not exist.")
        }

        return Mojo.parseJSON(jsonText);
    }
});