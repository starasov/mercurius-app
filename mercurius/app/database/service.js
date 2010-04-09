// ToDO: migrate from prototype based class creation to Class.create({}) form.

Database.Service = function(name, version, displayName, size) {
    Mojo.Log.info("[DbService.initialize] - begin");

    Mojo.requireString(name, "'name' parameter is required");
    Mojo.requireString(version, "'version' parameter is required");
    Mojo.requireString(displayName, "'displayName' parameter is required");
    Mojo.requireNumber(size, "'size' parameter is required");

    this._name = name;
    this._version  = version;
    this._displayName = displayName;
    this._size = size;
    this._db = null;

    Mojo.Log.info("[DbService.initialize] - end");
};

Database.Service.prototype.setVersionProvider = function(versionProvider) {
    this._versionProvider = versionProvider;
};

Database.Service.prototype.setDatabaseInitializer = function(databaseInitializer) {
    this._databaseInitializer = databaseInitializer;
};

Database.Service.prototype.getDatabase = function(successHandler, errorHandler) {
    if (this.isOpened()) {
        successHandler(this._db);
    } else {
        this.open(successHandler, errorHandler);
    }
};

Database.Service.prototype.open = function(successHandler, errorHandler) {
    Mojo.Log.info("[Database.Service.open] - begin");

    Mojo.require(this._databaseInitializer, "Database initializer instance should be set before 'open' method called.");
    Mojo.require(this._versionProvider, "Database version provider instance should be set before 'open' method called.");

    var clientSuccessHandler = successHandler || Prototype.emptyFunction;
    var clientErrorHandler = errorHandler || Prototype.emptyFunction;

    try {
        Mojo.Log.info("[Database.Service.open] - opening database...");
        this._db = openDatabase(this._name, "0.0", this._displayName, this._size);
        if (!this._db) {
            Mojo.Log.error("[DbService.open] - failed to open database!");
            clientErrorHandler();
        } else {
            this.processSuccessOpen(clientSuccessHandler, clientErrorHandler);
        }
    } catch(e) {
        Mojo.Log.error("[DbService.open] - failed to open database - %s", e);
        clientErrorHandler(e);
    }

    Mojo.Log.info("[Database.Service.open] - end");
};


Database.Service.prototype.isOpened = function() {
    return this._db != null;
};


/* @private */
Database.Service.prototype.processSuccessOpen = function processSuccessOpen(successHandler, errorHandler) {
    Mojo.Log.info("[DbService.processSuccessOpen] - end");

    if (this._versionProvider.hasCurrentVersion() && this._version != this._versionProvider.getCurrentVersion()) {
        Mojo.Log.info("[DbService.processSuccessOpen] - database version change detected from '%s' to '%s'", this._version, this._versionProvider.getCurrentVersion());
        this.handleDatabaseUpdate();
    } else if (!this._versionProvider.hasCurrentVersion()) {
        Mojo.Log.info("[DbService.processSuccessOpen] - database has not been previously created");
        this.handleDatabaseCreation(successHandler, errorHandler);
    }

    Mojo.Log.info("[DbService.processSuccessOpen] - end");
};


/* @private */
Database.Service.prototype.handleDatabaseCreation = function handleDatabaseCreation(clientSuccessHandler, clientErrorHandler) {
    this._databaseInitializer.initialize(this._db,
            (function() { clientSuccessHandler(this._db); }).bind(this),
            clientErrorHandler
    );
};

/* @private */
Database.Service.prototype.handleDatabaseUpdate = function handleDatabaseUpdate() {
    Mojo.require(false, "Not implemented!");
};