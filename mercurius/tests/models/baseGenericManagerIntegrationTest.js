Models.BaseGenericManagerIntegrationTest = Class.create({
    before: function(completionCallback) {
        this._tableModel = this.getTableModel();

        this._fixtures = this.getFixtures(this._tableModel);
        this._helper = this.getHelper(this._tableModel);
        this._mapper = this.getResultSetMapper(this._tableModel);

        this._db = null;

        this._service = new Database.Service("mercurius_test", "1.0", "mercurius_test", 100000);

        var initializer = new Database.Initializer();
        initializer.addTableModel(this._tableModel);
        this._service.setDatabaseInitializer(initializer);

        this._service.setVersionProvider(new MockVersionProvider());

        this._service.open((function(db) {
            this._db = db;
            this._manager = new Models.GenericManager(this._db, this._mapper, this._helper);
            this.executeStatements(this._fixtures, completionCallback, completionCallback);
        }).bind(this), this._handle_database_error.bind(this, completionCallback));
    },

    _handle_database_error: function(completionCallback, error) {
        Mojo.Log.info("[Models.BaseGenericManagerIntegrationTest._handle_database_error] - " + error);
        completionCallback();
    },

    getTableModel: function() {
        return {
            Name: "test_table_1",
            Columns: {
                id: new Database.Types.PrimaryKey()
            }
        };
    },

    getFixtures: function(tableModel) {
        return [];
    },

    getHelper: function(tableModel) {
        return new Models.GenericManagerHelper(tableModel);
    },

    getResultSetMapper: function(tableModel) {
        return new Models.ResultSetMapper(new Models.GenericMapper(tableModel));
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