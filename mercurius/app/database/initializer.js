Database.Initializer = Class.create({
    log: Utils.NullLog,
    
    initialize: function(jsonResourceReader) {
        Mojo.require(jsonResourceReader, "'jsonResourceReader' can't be null or undefined.");

        this.jsonResourceReader = jsonResourceReader;
        this.initializationScripts = []
    },

    addScript: function(scriptPath) {
        this.initializationScripts.push(scriptPath);
    },

    initializeDatabase: function(db, successCallback, errorCallback) {
        Mojo.requireFunction(successCallback, "[Database.Initializer.initialize] - 'successCallback' parameter should be a function.");
        Mojo.requireFunction(errorCallback, "[Database.Initializer.initialize] - 'errorCallback' parameter should be a function.");

        try {
            var scripts = this._readInitializationScripts();

            var createStatements = this._collectStatemenets(scripts, "createStatements");
            var initialDataStatements = this._collectStatemenets(scripts, "initialData");
            var allStatements = createStatements.concat(initialDataStatements);

            this._executeStatements(db, allStatements, successCallback, errorCallback);
        } catch(e) {
            this.log.error("[Database.Initializer.initialize] - exception occured: %s", e);
            errorCallback();
        }
    },

    _readInitializationScripts: function() {
        return this.initializationScripts.collect((function(path) {
            return this.jsonResourceReader.read(path);
        }).bind(this));
    },

    _collectStatemenets: function(scripts, key) {
        var statements = [];

        scripts.each(function(script) {
            if (script[key]) {
                script[key].each(function(statement) {
                    statements.push(statement);
                });
            }
        });

        return statements;
    },

    _executeStatements: function(db, statements, successCallback, errorCallback) {
        var transaction = new Database.Transaction(db);

        for (var i =  0; i < statements.length; i++) {
            transaction.addCommand(this._executeSql.bind(this, statements[i]));
        }

        transaction.execute(successCallback, errorCallback);
    },

    _executeSql: function(sql, transaction, successCallback, errorCallback) {
        this.log.info("[Database.Initializer._executeSql] - %s", sql);        
        transaction.executeSql(sql, [], successCallback, errorCallback);
    }
});

