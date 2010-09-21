TestsRunnerAssistant = Class.create({
    initialize: function(publishUrl) {
        this.publishUrl = publishUrl;
    },

    _getAllTests: function() {
        return [
            {title: "Accounts.ManagerFindIntegrationTest", source: "tests/accounts/managerFindIntegrationTest.js", test: Accounts.ManagerFindIntegrationTest},
            {title: "Accounts.SelectStatementTest", source: "tests/accounts/selectStatementTest.js", test: Accounts.SelectStatementTest},
            {title: "Accounts.ValidatorTest", source: "tests/accounts/validatorTest.js", test: Accounts.ValidatorTest},

            {title: "Currencies.FieldsTest", source: "tests/currencies/fieldsTest.js", test: Currencies.FieldsTest},
            {title: "Currencies.ManagerHomeCurrencyIntergrationTest", source: "tests/currencies/managerHomeCurrencyIntergrationTest.js", test: Currencies.ManagerHomeCurrencyIntergrationTest},
            {title: "Currencies.ManagerGetCurrencyByNameIntergrationTest", source: "tests/currencies/managerGetCurrencyByNameIntergrationTest.js", test: Currencies.ManagerGetCurrencyByNameIntergrationTest},
            {title: "Currencies.ValidatorTest", source: "tests/currencies/validatorTest.js", test: Currencies.ValidatorTest},

            {title: "Categories.ManagerFindIntegrationTest", source: "tests/categories/managerFindIntegrationTest.js", test: Categories.ManagerFindIntegrationTest},
            {title: "Categories.ValidatorTest", source: "tests/categories/validatorTest.js", test: Categories.ValidatorTest},

            {title: "Database.CountStatementTest", source: "tests/database/countStatementTest.js", test: Database.CountStatementTest},
            {title: "Database.DeleteStatementTest", source: "tests/database/deleteStatementTest.js", test: Database.DeleteStatementTest},
            {title: "Database.InitializerTest", source: "tests/database/initializerTest.js", test: Database.InitializerTest},
            {title: "Database.InsertStatementTest", source: "tests/database/insertStatementTest.js", test: Database.InsertStatementTest},
            {title: "Database.SelectStatementTest", source: "tests/database/selectStatementTest.js", test: Database.SelectStatementTest},
            {title: "Database.ServiceIntegrationTest", source: "tests/database/serviceIntegrationTest.js", test: Database.ServiceIntegrationTest},
            {title: "Database.TransactionTest", source: "tests/database/transactionTest.js", test: Database.TransactionTest},
            {title: "Database.TypesTest", source: "tests/database/typesTest.js", test: Database.TypesTest},
            {title: "Database.UpdateStatementTest", source: "tests/database/updateStatementTest.js", test: Database.UpdateStatementTest},
            {title: "Database.VersionProviderTest", source: "tests/database/versionProviderTest.js", test: Database.VersionProviderTest},

            {title: "Forms.FieldsTest", source: "tests/forms/fieldsTest.js", test: Forms.FieldsTest},
            {title: "Forms.GenericFormTest", source: "tests/forms/genericFormTest.js", test: Forms.GenericFormTest},

            {title: "Models.GenericManagerCountIntegrationTest", source: "tests/models/genericManagerCountIntegrationTest.js", test: Models.GenericManagerCountIntegrationTest},
            {title: "Models.GenericManagerDeleteByIdIntegrationTest", source: "tests/models/genericManagerDeleteByIdIntergationTest.js", test: Models.GenericManagerDeleteByIdIntegrationTest},
            {title: "Models.GenericManagerFindIntegrationTest", source: "tests/models/genericManagerFindIntegrationTest.js", test: Models.GenericManagerFindIntegrationTest},
            {title: "Models.GenericManagerTest", source: "tests/models/genericManagerTest.js", test: Models.GenericManagerTest},
            {title: "Models.GenericMapperTest", source: "tests/models/genericMapperTest.js", test: Models.GenericMapperTest},
            {title: "Models.ResultSetMapperTest", source: "tests/models/resultSetMapperTest.js", test: Models.ResultSetMapperTest},

            {title: "Transactions.SelectStatementTest", source: "tests/transactions/selectStatementTest.js", test: Transactions.SelectStatementTest},
            {title: "Transactions.ValidatorTest", source: "tests/transactions/validatorTest.js", test: Transactions.ValidatorTest},

            {title: "Validation.GenericValidatorTest", source: "tests/validation/genericValidatorTest.js", test: Validation.GenericValidatorTest},
            {title: "Validation.UtilsTest", source: "tests/validation/utilsTest.js", test: Validation.UtilsTest},

            {title: "Utils.JsonResourceReaderIntegrationTest", source: "tests/utils/jsonResourceReaderIntegrationTest.js", test: Utils.JsonResourceReaderIntegrationTest},
            {title: "Utils.AsyncChainTest", source: "tests/utils/asyncChainTest.js", test: Utils.AsyncChainTest},
            {title: "Utils.ParseDecimalTest", source: "tests/utils/parseDecimalTest.js", test: Utils.ParseDecimalTest}
        ]
    },

    setup: function() {
        this.statusField = this.controller.get("status-text");
        this.failedField = this.controller.get("failed-text");
        this.totalField = this.controller.get("total-text");

        this._loadTestSources();
    },

    activate: function() {
    },

    deactivate: function() {
    },

    cleanup: function() {
    },

    _loadTestSources: function() {
        this.statusField.innerHTML = "Loading test sources...";
        Mojo.Test.loadCollection(Mojo.appPath + "tests/test_sources.json", this._loadTests.bind(this));
    },

    _loadTests: function() {
        this.statusField.innerHTML = "Loading tests...";

        var sync = new Mojo.Function.Synchronize({syncCallback: this._runTests.bind(this)});

        this._getAllTests().each((function(testSpec) {
            if (testSpec.source && testSpec.source.length) {
                var loadCallback = sync.wrap(function() {
                    Mojo.Log.info("[TestAssistant._loadTestSources] - loaded: '%s'", testSpec.source);
                });

                Mojo.loadScriptWithCallback(testSpec.source, loadCallback);
            } else {
                Mojo.Log.error("[TestAssistant._loadTestSources] - invalid test spec: %j", testSpec)
            }
        }).bind(this));
    },

    _runTests: function() {
        this.statusField.innerHTML = "Running tests...";

        // create a test runner object
        this.runner = this._createCollectionRunner();

        // start the tests, call “whenCompleted” when done
        this.runner.start(this._publishResults.bind(this));
    },

    _createCollectionRunner: function() {
        var runner = new Mojo.Test.CollectionRunner(this._getAllTests());

        runner.runCurrentTest = (function() {
            this.currentTestRunner = new Mojo.Test.Runner(this, this.currentTest.test, {perf: this.options.perf});
            this.currentTestRunner.start();
        }).bind(runner);

        var _testFinished = runner.testFinished.bind(runner);
        runner.testFinished = (function(test) {
            test.results.each((function(result) {
                result.suite = this.currentTest.title;
                result.source = this.currentTest.source;
            }).bind(this));
            _testFinished(test);
        }).bind(runner);

        return runner;
    },
    _publishResults: function(results) {
        Mojo.Log.info("[_publishResults] - results: %j", this.runner.results);

        this.statusField.innerHTML = "Publishing results...";

        this._updateView();
        this._sendResults();
    },

    _updateView: function() {
        var failedCount = 0;
        this.runner.results.each(function(result) {
            if (!result.passed) {
                failedCount += 1;
            }
        });

        this.failedField.innerHTML = failedCount;
        if (failedCount) {
            this.failedField.addClassName("red")
        }

        this.totalField.innerHTML = this.runner.results.length;
        if (!failedCount) {
            this.totalField.addClassName("green")
        }
    },

    _sendResults: function() {
        new Ajax.Request(this.publishUrl, {
            method: "post",
            parameters: {results: Object.toJSON(this.runner.results)},
            evalJSON: "false",

            onSuccess: (function(response) {
                if (response.status == 200) {
                    this.statusField.innerHTML = "OK";
                } else {
                    this.statusField.innerHTML = "FAILED (status: " + response.status + ")";
                }
            }).bind(this),

            onFailure: (function() {
                this.statusField.innerHTML = "FAILED";
            }).bind(this)
        });
    }
});