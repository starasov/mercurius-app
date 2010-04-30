StageAssistant = Class.create({
    setup: function() {
        this.context = this._createApplicationContext();
        this.controller.pushScene("currencyList", this.context);
    },

    _createApplicationContext: function() {
        var databaseService = this._createDatabaseService();
        return new ApplicationContext(databaseService, new Currencies.Factory());
    },

    _createDatabaseService: function() {
        var databaseService = new Database.Service("mercurius", "1.0", "Mercurius Database", 200000);
        databaseService.setVersionProvider(new Database.VersionProvider("mercurius"));

        var databaseInitializer = new Database.Initializer();
        databaseInitializer.addTableModel(Currencies.TableModel);

        databaseInitializer.addPostCreateSqlStatement("INSERT INTO currencies VALUES(1, 'US Dollar', '$', 11223344.0, 1);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO currencies VALUES(2, 'Euro', 'EUR', 1.2, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO currencies VALUES(3, 'GB Pound', 'GPB', 1.4, 0);");

        databaseService.setDatabaseInitializer(databaseInitializer);

        return databaseService;
    }
});