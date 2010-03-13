Models.BaseGenericManagerIntegrationTest = Class.create({
    before: function(completionCallback) {
        this._tableModel = this.getTableModel();
        this._fixtures = this.getFixtures(this._tableModel);

        this._service = new Database.Service("mercurius_test", "1.0", "mercurius_test", 100000);
        this._service.setDatabaseInitializer(new Database.Initializer());
        this._service.setVersionProvider(new Database.VersionProvider("mercurius_test"));
        this._service.addTableModel(this._tableModel);

        this._service.open(this._insert_sample_records.bind(this, completionCallback),
            this._handle_database_error.bind(this, completionCallback));
    },

    _insert_sample_records: function(completionCallback, _) {
        this.executeStatements(this._fixtures, completionCallback, completionCallback);
    },

    _handle_database_error: function(completionCallback, _, error) {
        Mojo.Log.info("[Models.GenericManagerIntegrationTest._handle_database_error] - " + error.message);
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
        return ["DELETE FROM " + tableModel.Name + ";"];
    },

    executeStatements: function(statements, successCallback, errorCallback) {
        this._service.getDatabase().transaction((function(transaction) {
            for (var i = 0; i < statements.length; i++) {
                var successCallbackCurrent = (i == statements.length - 1) ? successCallback : Prototype.emptyFunction;

                transaction.executeSql(statements[i], [], successCallbackCurrent,
                        this._handle_database_error.bind(this, errorCallback));
            }
        }).bind(this));
    }
});