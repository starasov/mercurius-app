Database.VersionProviderTest = Class.create({
    initialize: function() {
        this.databaseName = "test_mercurius";
    },

    before: function() {
        this.databaseVersionCookie = new Mojo.Model.Cookie(Database.VersionProvider.DATABASE_VERSION_COOKIE_NAME_PREFIX + this.databaseName);
        this.databaseVersionCookie.remove();

        this.databaseVersionProvider = new Database.VersionProvider(this.databaseName);

        return Mojo.Test.beforeFinished;
    },

    after: function(completionCallback) {
        this.databaseVersionCookie.remove();
        completionCallback();
    },

    test_should_not_have_database_version_when_cookie_not_exists: function() {
        Mojo.requireFalse(this.databaseVersionProvider.hasCurrentVersion());
        return Mojo.Test.passed;
    },

    test_should_have_database_version_when_cookie_exists: function() {
        this.databaseVersionCookie.put("0.0");
        Mojo.require(this.databaseVersionProvider.hasCurrentVersion());

        return Mojo.Test.passed;
    },

    test_should_return_current_version: function() {
        this.databaseVersionCookie.put("1.0");
        Mojo.requireEqual("1.0", this.databaseVersionProvider.getCurrentVersion());

        return Mojo.Test.passed;
    },

    test_should_update_current_version: function() {
        this.databaseVersionCookie.put("1.0");
        this.databaseVersionProvider.setCurrentVersion("2.0");
        Mojo.requireEqual("2.0", this.databaseVersionCookie.get());

        return Mojo.Test.passed;
    },

    test_should_cleanup_current_version: function() {
        this.databaseVersionCookie.put("1.0");
        this.databaseVersionProvider.cleanupCurrentVersion();
        Mojo.requireEqual(undefined, this.databaseVersionCookie.get());

        return Mojo.Test.passed;
    }
});
