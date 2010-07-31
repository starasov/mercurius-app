Database.Service = Class.create({
    log: Utils.NullLog,

    initialize: function(name, version, displayName, size) {
        this.log.info("[initialize] - begin");

        Mojo.requireString(name, "'name' parameter is required");
        Mojo.requireString(version, "'version' parameter is required");
        Mojo.requireString(displayName, "'displayName' parameter is required");
        Mojo.requireNumber(size, "'size' parameter is required");

        this._name = name;
        this._version  = version;
        this._displayName = displayName;
        this._size = size;
        this._db = null;

        this.log.info("[initialize] - end");
    },

    setVersionProvider: function(versionProvider) {
        this._versionProvider = versionProvider;
    },

    setDatabaseInitializer: function(databaseInitializer) {
        this._databaseInitializer = databaseInitializer;
    },

    getDatabase: function(successHandler, errorHandler) {
        if (this.isOpened()) {
            successHandler(this._db);
        } else {
            this.open(successHandler, errorHandler);
        }
    },

    open: function(successHandler, errorHandler) {
        this.log.info("[Database.Service.open] - begin");

        Mojo.require(this._databaseInitializer, "Database initializer instance should be set before 'open' method called.");
        Mojo.require(this._versionProvider, "Database version provider instance should be set before 'open' method called.");

        var clientSuccessHandler = successHandler || Prototype.emptyFunction;
        var clientErrorHandler = errorHandler || Prototype.emptyFunction;

        try {
            this.log.info("[Database.Service.open] - opening database...");
            this._db = openDatabase(this._name, "0.0", this._displayName, this._size);
            if (!this._db) {
                this.log.error("[DbService.open] - failed to open database!");
                clientErrorHandler();
            } else {
                this.processSuccessOpen(clientSuccessHandler, clientErrorHandler);
            }
        } catch(e) {
            this.log.error("[DbService.open] - failed to open database - %s", e);
            clientErrorHandler(e);
        }

        this.log.info("[Database.Service.open] - end");
    },

    isOpened: function() {
        return this._db != null;
    },

    processSuccessOpen: function processSuccessOpen(successHandler, errorHandler) {
        this.log.info("[DbService.processSuccessOpen] - end");

        if (this._versionProvider.hasCurrentVersion() && this._version != this._versionProvider.getCurrentVersion()) {
            this.log.info("[DbService.processSuccessOpen] - database version change detected from '%s' to '%s'", this._version, this._versionProvider.getCurrentVersion());
            this.handleDatabaseUpdate();
        } else if (!this._versionProvider.hasCurrentVersion()) {
            this.log.info("[DbService.processSuccessOpen] - database has not been previously created");
            this.handleDatabaseCreation(successHandler, errorHandler);
        }

        this.log.info("[DbService.processSuccessOpen] - end");
    },

    handleDatabaseCreation: function(clientSuccessHandler, clientErrorHandler) {
        this._databaseInitializer.initializeDatabase(this._db, clientSuccessHandler.curry(this._db), clientErrorHandler);
    },

    handleDatabaseUpdate: function() {
        Mojo.require(false, "Not implemented!");
    }
});

