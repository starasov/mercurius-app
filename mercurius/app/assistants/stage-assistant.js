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
        this.controller.pushScene("accountList", this.context);
//        this.controller.pushScene("transactionList", this.context);
//        this.controller.pushScene("currencyList", this.context);
//        this.controller.pushScene("categoryList", this.context);
//        this.controller.pushScene("categoryPickerList", this.context);
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

        var databaseInitializer = new Database.Initializer();
        databaseInitializer.addTableModel(Accounts.TableModel);
        databaseInitializer.addTableModel(Currencies.TableModel);
        databaseInitializer.addTableModel(Categories.TableModel);
        databaseInitializer.addTableModel(Transactions.TableModel);

        databaseInitializer.addPostCreateSqlStatement("INSERT INTO currencies VALUES(1, 'US Dollar', '$', 11223344.0, 1);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO currencies VALUES(2, 'Euro', 'EUR', 1.2, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO currencies VALUES(3, 'GB Pound', 'GPB', 1.4, 0);");

        databaseInitializer.addPostCreateSqlStatement("INSERT INTO accounts VALUES(1, 'Cash', 10000, 1, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO accounts VALUES(2, 'VISA USD', 200000, 1, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO accounts VALUES(3, 'VISA EUR', 0, 2, 1);");

        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(1, 'Food', 2, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(2, 'Entertainment', 2, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(4, 'Salary', 1, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(5, 'Bonus', 1, 0);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(6, 'Books', 2, 2);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(7, 'Cinema', 2, 2);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(8, 'Cafe', 2, 2);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO categories VALUES(9, 'Business Trip', 1, 4);");

        databaseInitializer.addPostCreateSqlStatement("INSERT INTO transactions VALUES(1, 2, 2000, 1, 1, 1);");
        databaseInitializer.addPostCreateSqlStatement("INSERT INTO transactions VALUES(2, 1, 10000, 1, 2, 4);");

        databaseService.setDatabaseInitializer(databaseInitializer);

        return databaseService;
    }
});