Database.Service = function(name, version, displayName, size) {
    Mojo.Log.info("[DbService.initialize] - begin");

    Mojo.require(name, "'name' parameter is required");
    Mojo.require(version, "'version' parameter is required");
    Mojo.require(displayName, "'displayName' parameter is required");
    Mojo.require(size, "'size' parameter is required");

    this.name = name;
    Mojo.Log.info("[DbService.initialize] this.name = %s", this.name);

    this.version  = version;
    Mojo.Log.info("[DbService.initialize] this.version = %s", this.version);

    this.displayName = displayName;
    Mojo.Log.info("[DbService.initialize] this.displayName = %s", this.displayName);

    this.size = size;
    Mojo.Log.info("[DbService.initialize] this.size = %s", this.size);

    this.db = null;
    this.modelDescriptors = [];

    Mojo.Log.info("[DbService.initialize] - end");
};

Database.Service.prototype.setVersionProvider = function(versionProvider) {
    this.versionProvider = versionProvider;
};


Database.Service.prototype.setDatabaseInitializer = function(databaseInitializer) {
    this.databaseInitializer = databaseInitializer;
};


Database.Service.prototype.addTableModel = function(tableModel) {
    this.databaseInitializer.addTableModel(tableModel);
};


Database.Service.prototype.open = function(successHandler, errorHandler) {
    Mojo.Log.info("[DbService.open] - begin");

    Mojo.require(this.versionProvider, "Database version provider instance should be set before 'open' method call.");

    try {
        Mojo.Log.info("[DbService.open] - opening database...");

        this.db = openDatabase(this.name, "0.0", this.displayName, this.size);
        if (!this.db) {
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
    return this.db != null;
};


Database.Service.prototype.getDatabase = function() {
    return this.db;
};


/* @private */
Database.Service.prototype.processSuccessOpen = function processSuccessOpen(successHandler, errorHandler) {
    Mojo.Log.info("[DbService.processSuccessOpen] - end");

    if (this.versionProvider.hasCurrentVersion() && this.version != this.versionProvider.getCurrentVersion()) {
        Mojo.Log.info("[DbService.processSuccessOpen] - database version change detected from '%s' to '%s'", this.version, this.versionProvider.getCurrentVersion());
        this.handleDatabaseUpdate();
    } else if (!this.versionProvider.hasCurrentVersion()) {
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
    this.databaseInitializer.initialize(this.db,
            (function() { clientSuccessHandler(this); }).bind(this),
            (function(result) { clientErrorHandler(this, result); }).bind(this)
    );
};

/* @private */
Database.Service.prototype.handleDatabaseUpdate = function handleDatabaseUpdate() {
    Mojo.require(false, "Not implemented!");
};