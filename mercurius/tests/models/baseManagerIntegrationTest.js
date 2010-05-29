Models.BaseManagerIntegrationTest = Class.create({
    before: function(completionCallback) {
        this._tableModels = this.getTableModels();
        this._fixtures = this.getFixtures();
        this._db = null;

        this._service = new Database.Service("mercurius_test", "1.0", "mercurius_test", 100000);

        var initializer = new Database.Initializer();
        for (var i = 0; i < this._tableModels.length; i++) {
            initializer.addTableModel(this._tableModels[i]);
        }

        this._service.setDatabaseInitializer(initializer);
        this._service.setVersionProvider(new MockVersionProvider());

        this._service.open((function(db) {
            this._db = db;
            this.executeStatements(this._fixtures, completionCallback, completionCallback);
        }).bind(this), this._handle_database_error.bind(this, completionCallback));
    },

    _handle_database_error: function(completionCallback, error) {
        Mojo.Log.info("[Models.BaseGenericManagerIntegrationTest._handle_database_error] - " + error);
        Mojo.require(false);
    },

    getTableModels: function() {
        return [{
            Name: "test_table_1",
            Columns: {
                id: new Database.Types.PrimaryKey()
            }
        }];
    },

    getFixtures: function() {
        return [];
    },

    executeStatements: function(statements, successCallback, errorCallback) {
        if (statements.length > 0) {
            this._db.transaction((function(transaction) {
                for (var i = 0; i < statements.length; i++) {
                    var successCallbackCurrent = (i == statements.length - 1) ? successCallback : Prototype.emptyFunction;
                    transaction.executeSql(statements[i], [], successCallbackCurrent,
                            this._handle_database_error.bind(this, errorCallback));
                }
            }).bind(this));
        } else {
            successCallback();
        }
    }
});