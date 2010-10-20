Database.InitializerTest = Class.create({
    before: function() {
        this.initializer = new Database.Initializer(new Utils.JsonResourceReader());
        this.mockDatabase = new MockDatabase(true);

        return Mojo.Test.beforeFinished;
    },

    test_should_raise_exception_when_passed_resource_reader_is_null: function() {
        Test.requireException(function() {
            new Database.Initializer();
        });

        return Mojo.Test.passed;
    },

    test_should_fail_initialization_when_no_error_callback_specified: function() {
        Test.requireException((function() {
            this.initializer.initializeDatabase(this.mockDatabase, Prototype.emptyFunction, null);
        }).bind(this));
        
        return Mojo.Test.passed;
    },

    test_should_fail_initialization_when_no_success_callback_specified: function() {
        Test.requireException((function() {
            this.initializer.initializeDatabase(this.mockDatabase, null, Prototype.emptyFunction);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_should_call_success_callback_when_database_initialized_successfully: function(recordResults) {
        this._ensureSuccessInitializationForScript(Mojo.appPath + "tests/resources/database/sample_currencies.json", recordResults);
    },

    test_should_execute_expected_number_of_statements: function(recordResults) {
        this.initializer.addScript(Mojo.appPath + "tests/resources/database/sample_currencies.json");
        this.initializer.initializeDatabase(this.mockDatabase, (function() {
            Test.validate(recordResults, Mojo.requireEqual.curry(5, this.mockDatabase.getTotalExecutedCount()));
        }).bind(this), function() {
            recordResults("Should correctly intialize db.");
        });
    },

    test_should_successfully_initialize_when_initial_data_section_missing: function(recordResults) {
        this._ensureSuccessInitializationForScript(Mojo.appPath + "tests/resources/database/sample_currencies_no_initial_data.json", recordResults);
    },

    test_should_successfully_initialize_when_create_statements_section_missing: function(recordResults) {
        this._ensureSuccessInitializationForScript(Mojo.appPath + "tests/resources/database/sample_currencies_no_create_statements.json", recordResults);
    },

    test_should_call_error_callback_when_invalid_resource_path_specified: function(recordResults) {
        this.initializer.addScript(Mojo.appPath + "tests/resources/database/sample_currencies.xml");
        this.initializer.initializeDatabase(this.mockDatabase, (function() {
            recordResults("Should not call success callback when invalid path specified.");
        }).bind(this), function() {
            recordResults();
        });
    },

    _ensureSuccessInitializationForScript: function(scriptPath, recordResults) {
        this.initializer.addScript(scriptPath);
        this.initializer.initializeDatabase(this.mockDatabase, function() {
            recordResults();
        }, function() {
            recordResults("Should correctly intialize db.");
        });
    }
});