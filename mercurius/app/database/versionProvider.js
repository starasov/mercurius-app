Database.VersionProvider = function(databaseName) {
    Mojo.require(databaseName);
    
    this.databaseName = databaseName;
    this.databaseVersionCookie = new Mojo.Model.Cookie(Database.VersionProvider.DATABASE_VERSION_COOKIE_NAME_PREFIX + databaseName);
};

/* @static */
Database.VersionProvider.DATABASE_VERSION_COOKIE_NAME_PREFIX = "mercurius.database.";

Database.VersionProvider.prototype.hasCurrentVersion = function() {
    return this.databaseVersionCookie.get() != undefined;
};

Database.VersionProvider.prototype.getCurrentVersion = function() {
    return this.databaseVersionCookie.get();
};

Database.VersionProvider.prototype.setCurrentVersion = function(databaseVersion) {
    Mojo.require(databaseVersion);
    this.databaseVersionCookie.put(databaseVersion);
};

Database.VersionProvider.prototype.cleanupCurrentVersion = function() {
    this.databaseVersionCookie.remove();
};