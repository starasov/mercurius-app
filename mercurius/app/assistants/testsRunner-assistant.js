TestsRunnerAssistant = Class.create({
    initialize: function(publishUrl) {
        this.publishUrl = publishUrl;
    },

    _getAllTests: function() {
        return AllTests();
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

                try {
                    Mojo.loadScriptWithCallback(testSpec.source, loadCallback);
                } catch(e) {
                    Mojo.Log.error("[TestsRunnerAssistant] - failed to load test source %s (%s)", testSpec.source, e);
                }

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