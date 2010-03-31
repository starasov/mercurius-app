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


Database.Service.prototype.addTableModel = function(tableModel) {
    this._databaseInitializer.addTableModel(tableModel);
};


Database.Service.prototype.open = function(successHandler, errorHandler) {
    Mojo.Log.info("[DbService.open] - begin");

    Mojo.require(this._versionProvider, "Database version provider instance should be set before 'open' method call.");

    try {
        Mojo.Log.info("[DbService.open] - opening database...");

        this._db = openDatabase(this._name, "0.0", this._displayName, this._size);
        if (!this._db) {
            this.processOpenFailure(errorHandler);
        } else {
            this.processSuccessOpen(successHandler);
        }
    } catch(e) {
        this.processOpenException(e, errorHandler);
    }

    Mojo.Log.info("[DbService.open] - end");
};


Database.Service.prototype.isOpened = function() {
    return this._db != null;
};


Database.Service.prototype.getDatabase = function() {
    return this._db;
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
Database.Service.prototype.processOpenFailure = function processOpenFailure(errorHandler) {
    Mojo.Log.error("[DbService.open] - database open failed!");
    if (typeof(errorHandler) != 'undefined') {
        errorHandler(this);
    }
};

/* @private */
Database.Service.prototype.processOpenException = function processOpenException(e, errorHandler) {
    Mojo.Log.logException(e, "[DbService.open] - database open exception!");
    if (typeof(errorHandler) != 'undefined') {
        errorHandler(this);
    }
};


/* @private */
Database.Service.prototype.handleDatabaseCreation = function handleDatabaseCreation(clientSuccessHandler, clientErrorHandler) {
    this._databaseInitializer.initialize(this._db,
            (function() { clientSuccessHandler(this); }).bind(this),
            (function(result) { clientErrorHandler(this, result); }).bind(this)
    );
};

/* @private */
Database.Service.prototype.handleDatabaseUpdate = function handleDatabaseUpdate() {
    Mojo.require(false, "Not implemented!");
};