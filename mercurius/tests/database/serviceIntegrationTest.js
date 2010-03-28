Database.ServiceIntegrationTest = Class.create({
    initialize: function() {
        this.name = "mercurius_test";
        this.version = "1.0";
        this.displayName = "Mercurius Test Database";
        this.size = 200000;
    },

    before: function() {
        this.databaseVersionProvider = new Database.VersionProvider(this.name);
        this.databaseVersionProvider.cleanupCurrentVersion();

        this.databaseInitializer = new Database.Initializer();

        this.databaseService = new Database.Service(this.name, this.version, this.displayName, this.size);
        this.databaseService.setVersionProvider(this.databaseVersionProvider);
        this.databaseService.setDatabaseInitializer(this.databaseInitializer);

        return Mojo.Test.beforeFinished;
    },

    after: function(completionCallback) {
        this.databaseVersionProvider.cleanupCurrentVersion();
        completionCallback();
    },

    test_should_not_be_opened_initially: function() {
        var dbService = new Database.Service(this.name, this.version, this.displayName, this.size);
        Mojo.requireFalse(dbService.isOpened());
        return Mojo.Test.passed;
    },

    test_should_create_and_initialize_new_database_when_no_database_exists: function(reportResults) {
        var testTableModel = {
            Name: "test",
            Columns: {
                id: new Database.Types.PrimaryKey()
            }
        };

        this.databaseService.addTableModel(testTableModel);
        this.databaseService.open(
                (function(databaseService) { reportResults(Mojo.Test.passed); }).bind(this),
                (function(databaseService, result) { reportResults(result); }).bind(this)
        );
    }
});