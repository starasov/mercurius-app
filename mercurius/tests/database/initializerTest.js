Database.InitializerTest = Class.create({
    before: function() {
        this.tableModel = {
            Name: "test",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String()
            }
        };

        this.initializer = new Database.Initializer();
        this.mockDatabase = new MockDatabase();
        this.mockTransaction = new MockTransaction();

        this.mockSuccessHandler = function() {
            this.invoked = true;
        };

        this.mockErrorHandler = function() {
            this.invoked = true;
        };

        return Mojo.Test.beforeFinished;
    },

    test_should_create_table_sql_for_model: function() {
        var testTableModel = {
            Name: "test",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                description: new Database.Types.String(),
                azimuth: new Database.Types.Real()
            }
        };

        var sql = this.initializer._generateCreateTableModelSql(testTableModel);
        Mojo.requireEqual("CREATE TABLE test(id INTEGER PRIMARY KEY NOT NULL, name TEXT NULL, description TEXT NULL, azimuth REAL NULL); GO;", sql);

        return Mojo.Test.passed;
    },

    test_should_generate_valid_drop_table_sql_for_model: function() {
        this.initializer.addTableModel(this.tableModel);
        var sql = this.initializer._generateDropTableModelsSql();
        Mojo.requireEqual("DROP TABLE IF EXISTS test; GO;", sql[0]);

        return Mojo.Test.passed;
    },

    test_should_create_table_sql_for_model_with_nullable_fields: function() {
        var testTableModel = {
            Name: "test",
            Columns: {
                name: new Database.Types.String(Database.Types.Nullable)
            }
        };

        var sql = this.initializer._generateCreateTableModelSql(testTableModel);
        Mojo.requireEqual("CREATE TABLE test(name TEXT NULL); GO;", sql);

        return Mojo.Test.passed;
    },

    test_should_create_table_sql_for_model_with_not_nullable_fields: function() {
        var testTableModel = {
            Name: "test",
            Columns: {
                "name": new Database.Types.String(Database.Types.NonNullable)
            }
        };

        var sql = this.initializer._generateCreateTableModelSql(testTableModel);
        Mojo.requireEqual("CREATE TABLE test(name TEXT NOT NULL); GO;", sql);

        return Mojo.Test.passed;
    },

    test_should_order_table_columns_in_same_to_declaration_order: function() {
        var sql = this.initializer._generateCreateTableModelSql(this.tableModel);
        Mojo.requireEqual("CREATE TABLE test(id INTEGER PRIMARY KEY NOT NULL, name TEXT NULL); GO;", sql);

        return Mojo.Test.passed;
    },

    test_should_fail_initialization_when_no_error_callback_specified: function() {
        Test.requireException((function() {
            this.initializer.initializeDatabase(new MockDatabase(), Prototype.emptyFunction, null);
        }).bind(this));
        
        return Mojo.Test.passed;
    },

    test_should_fail_initialization_when_no_success_callback_specified: function() {
        Test.requireException((function() {
            this.initializer.initializeDatabase(new MockDatabase(), null, Prototype.emptyFunction);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_should_call_error_handler_when_database_error_occurred: function() {
        this.initializer.addTableModel(this.tableModel);
        this.initializer.initializeDatabase(this.mockDatabase, Prototype.emptyFunction,
                this.mockErrorHandler.bind(this.mockErrorHandler));

        this.mockDatabase.callback(this.mockTransaction);
        this.mockTransaction.errorHandler(this.mockTransaction, {});

        Mojo.require(this.mockErrorHandler.invoked);

        return Mojo.Test.passed;
    },

    test_should_call_success_handler_when_all_transactions_are_completed: function() {
        this.initializer.addTableModel(this.tableModel);
        this.initializer.initializeDatabase(this.mockDatabase, this.mockSuccessHandler.bind(this.mockSuccessHandler),
                Prototype.emptyFunction);

        this.mockDatabase.callback(this.mockTransaction);
        
        // DROP TABLE statement is executed here.
        this.mockTransaction.successHandler(this.mockTransaction, {});

        // CREATE TABLE statement is executed here.
        this.mockTransaction.successHandler(this.mockTransaction, {});

        Mojo.require(this.mockSuccessHandler.invoked);
        return Mojo.Test.passed;
    },


    test_should_not_call_success_handler_when_pending_transactions_exist: function() {
        this.initializer.addTableModel(this.tableModel);

        this.initializer.initializeDatabase(this.mockDatabase, this.mockSuccessHandler.bind(this.mockSuccessHandler),
                Prototype.emptyFunction);

        this.mockDatabase.callback(this.mockTransaction);
        this.mockTransaction.successHandler(this.mockTransaction, {});

        Mojo.requireFalse(this.mockSuccessHandler.invoked);

        return Mojo.Test.passed;
    },


    test_should_execute_passed_post_sql_statements: function() {
        this.initializer.addTableModel(this.tableModel);

        var customInsertStatement = "INSERT INTO test (name) VALUES('name goes there'); GO;";
        this.initializer.addPostCreateSqlStatement(customInsertStatement);

        this.initializer.initializeDatabase(this.mockDatabase, this.mockSuccessHandler.bind(this.mockSuccessHandler),
                Prototype.emptyFunction);

        this.mockDatabase.callback(this.mockTransaction);

        // DROP TABLE statement is executed here.
        this.mockTransaction.successHandler(this.mockTransaction, {});

        // CREATE TABLE statement is executed here.
        this.mockTransaction.successHandler(this.mockTransaction, {});

        // Post create INSERT statement is executed here.
        this.mockTransaction.successHandler(this.mockTransaction, {});

        Mojo.requireEqual(customInsertStatement, this.mockTransaction.sql);
        return Mojo.Test.passed;
    }
});