StageAssistant = Class.create({
    setup: function() {
        var params = Mojo.getLaunchParameters();
        if (params["mercuriusRunTests"]) {
            this._setupTests(params)
        } else {
            this._setup();
        }
    },

    _setup: function() {
        this.context = this._createApplicationContext();
        this.controller.pushScene("mainView", this.context);
    },

    _setupTests: function(launchParams) {
        var publishingUrl = ["http://", launchParams["host"], ":8080/publish_results/"].join("");
        Mojo.Log.info("[StageAssistant._setupTests] - %s", publishingUrl);
        this.controller.pushScene("testsRunner", publishingUrl);
    },

    _createApplicationContext: function() {
        var databaseService = this._createDatabaseService();
        var currenciesFactory = new Currencies.Factory();
        var accountsFactory = new Accounts.Factory();
        var categoriesFactory = new Categories.Factory();
        var transactionsFactory = new Transactions.Factory();

        return new ApplicationContext(databaseService, currenciesFactory, accountsFactory, categoriesFactory, transactionsFactory);
    },

    _createDatabaseService: function() {
        var databaseService = new Database.Service("mercurius", "1.0", "Mercurius Database", 200000);

        databaseService.setVersionProvider(new Database.VersionProvider("mercurius"));
        databaseService.setDatabaseInitializer(this._createDatabaseInitializer());

        return databaseService;
    },

    _createDatabaseInitializer: function() {
        var databaseInitializer = new Database.Initializer(new Utils.JsonResourceReader());

        databaseInitializer.addScript(this._getResourcePath("database/accounts.json"));
        databaseInitializer.addScript(this._getResourcePath("database/accounts_initial.json"));
        databaseInitializer.addScript(this._getResourcePath("database/categories.json"));
        databaseInitializer.addScript(this._getResourcePath("database/currencies.json"));
        databaseInitializer.addScript(this._getResourcePath("database/transactions.json"));

        return databaseInitializer;
    },

    _getResourcePath: function(path) {
        return [Mojo.appPath, "resources/", path].join("");
    }
});