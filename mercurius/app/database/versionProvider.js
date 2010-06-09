Database.VersionProvider = Class.create({
    initialize: function(databaseName) {
        Mojo.require(databaseName);

        this.databaseName = databaseName;
        this.databaseVersionCookie = new Mojo.Model.Cookie(Database.VersionProvider.DATABASE_VERSION_COOKIE_NAME_PREFIX + databaseName);
    },

    hasCurrentVersion: function() {
        return this.databaseVersionCookie.get() != undefined;
    },

    getCurrentVersion: function() {
        return this.databaseVersionCookie.get();
    },

    setCurrentVersion: function(databaseVersion) {
        Mojo.require(databaseVersion);
        this.databaseVersionCookie.put(databaseVersion);
    },

    cleanupCurrentVersion: function() {
        this.databaseVersionCookie.remove();
    }
});

Database.VersionProvider.prototype.DATABASE_VERSION_COOKIE_NAME_PREFIX = "mercurius.database.";