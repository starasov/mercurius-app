Database.InitializerTest = function() {
};

Database.InitializerTest.prototype.before = function() {
    this.testTableModel = {
        Name: "test",
        Columns: {
            id: new Database.Types.PrimaryKey()
        }
    };

    this.initializer = new Database.Initializer();
    
    return Mojo.Test.beforeFinished;
};

Database.InitializerTest.prototype.after = function(completionCallback) {
    completionCallback();
};

Database.InitializerTest.prototype.
        test_should_create_table_sql_for_model = function()
{
    var testTableModel = {
        Name: "test",
        Columns: {
            "id": new Database.Types.PrimaryKey(),
            "name": new Database.Types.String(),
            "description": new Database.Types.String(),
            "azimuth": new Database.Types.Real()
        }
    };

    var sql = this.initializer._createTableModelSql(testTableModel);
    Mojo.requireEqual("CREATE TABLE IF NOT EXISTS test(id INTEGER PRIMARY KEY, name TEXT, description TEXT, azimuth REAL); GO;", sql);

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_create_table_sql_for_model_with_nullable_fields = function()
{
    var testTableModel = {
        Name: "test",
        Columns: {
            "name": new Database.Types.String(Database.Types.Nullable)
        }
    };

    var sql = this.initializer._createTableModelSql(testTableModel);
    Mojo.requireEqual("CREATE TABLE IF NOT EXISTS test(name TEXT NULL); GO;", sql);

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_create_table_sql_for_model_with_not_nullable_fields = function()
{
    var testTableModel = {
        Name: "test",
        Columns: {
            "name": new Database.Types.String(Database.Types.NonNullable)
        }
    };

    var sql = this.initializer._createTableModelSql(testTableModel);
    Mojo.requireEqual("CREATE TABLE IF NOT EXISTS test(name TEXT NOT NULL); GO;", sql);

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_order_table_columns_in_same_to_declaration_order = function()
{
    var sql = this.initializer._createTableModelSql(this.testTableModel);
    Mojo.requireEqual("CREATE TABLE IF NOT EXISTS test(id INTEGER PRIMARY KEY); GO;", sql);

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_fail_initialization_when_no_error_callback_specified = function()
{

    try {
        this.initializer.initialize(new MockDatabase(), function() {}, null);
        Mojo.require(false, "initializer should ensure that function callback passed as error handler callback");
    } catch(e) {
        // Expected behavior.
    }

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_fail_initialization_when_no_success_callback_specified = function()
{

    try {
        this.initializer.initialize(new MockDatabase(), null, function() {});
        Mojo.require(false, "initializer should ensure that function callback passed as success handler callback");
    } catch(e) {
        // Expected behavior.
    }

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_call_error_handler_when_database_error_occurred = function()
{
    var mockDatabase = new MockDatabase();
    var mockErrorHandler = function() { this.invoked = true; };

    this.initializer.addTableModel(this.testTableModel);
    this.initializer.initialize(mockDatabase, function() {}, mockErrorHandler.bind(mockErrorHandler));

    var mockTransaction = new MockTransaction();
    mockDatabase.callback(mockTransaction);
    mockTransaction.errorHandler(mockTransaction, {});

    Mojo.require(mockErrorHandler.invoked);

    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_call_success_handler_when_all_transactions_are_completed = function()
{
    var mockDatabase = new MockDatabase();
    var mockSuccessHandler = function() { this.invoked = true; };

    this.initializer.addTableModel(this.testTableModel);
    this.initializer.initialize(mockDatabase, mockSuccessHandler.bind(mockSuccessHandler), function() {});

    var mockTransaction = new MockTransaction();
    mockDatabase.callback(mockTransaction);
    mockTransaction.successHandler(mockTransaction, {});

    Mojo.require(mockSuccessHandler.invoked);
                         
    return Mojo.Test.passed;
};

Database.InitializerTest.prototype.
        test_should_not_call_success_handler_when_pending_transactions_exist = function()
{
    var mockDatabase = new MockDatabase();
    var mockSuccessHandler = function() { this.invoked = true; };

    this.initializer.addTableModel(this.testTableModel);
    this.initializer.addTableModel(this.testTableModel);

    this.initializer.initialize(mockDatabase, mockSuccessHandler.bind(mockSuccessHandler), function() {});

    var mockTransaction = new MockTransaction();
    mockDatabase.callback(mockTransaction);
    mockTransaction.successHandler(mockTransaction, {});

    Mojo.requireFalse(mockSuccessHandler.invoked);

    return Mojo.Test.passed;
};