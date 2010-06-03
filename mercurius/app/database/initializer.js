Database.Initializer = Class.create({
    log: Utils.NullLog,
    
    initialize: function() {
        this._tableModels = [];
        this._pendingTransactions = 0;
        this._lastTransactionResult = "success";
        this._postCreateStatements = [];
    },

    addTableModel: function(tableModel) {
        this._tableModels.push(tableModel);
    },

    addPostCreateSqlStatement: function(statement) {
        Mojo.requireString(statement, "Passed 'statement' parameter should be string type.");
        this._postCreateStatements.push(statement);
    },

    initializeDatabase: function(db, successHandler, errorHandler) {
        this.log.info("[DatabaseInitializer.initialize] - begin");

        Mojo.requireFunction(successHandler, "[Database.Initializer.initialize] - 'successHandler' parameter should be a function.");
        Mojo.requireFunction(errorHandler, "[Database.Initializer.initialize] - 'errorHandler' parameter should be a function.");

        var statements = this._generateDropTableModelsSql().concat(this._generateCreateTableModelsSql());
        statements = statements.concat(this._postCreateStatements);

        this._pendingTransactions = statements.length;
        this.log.info("[DatabaseInitializer.initialize] - this.pendingTransactions: %s", this._pendingTransactions);

        for (var i =  0; i < statements.length; i++) {
            this.log.info("[DatabaseInitializer.initialize] - is about to execute (inner): %s", statements[i]);

            var sql = statements[i];
            db.transaction((function(sql, transaction) {
                this.log.info("[DatabaseInitializer.initialize] - is about to execute (outer): %s", sql);
                this._executeSql(transaction, sql, successHandler, errorHandler);
            }).bind(this, sql));
        }

        this.log.info("[DatabaseInitializer.initialize] - end");
    },

    _generateDropTableModelsSql: function() {
        var dropTableModelsSql = [];

        for (var i = 0; i < this._tableModels.length; i++) {
            dropTableModelsSql.push("DROP TABLE IF EXISTS " + this._tableModels[i].Name + "; GO;");
        }

        return dropTableModelsSql;
    },

    _generateCreateTableModelsSql: function() {
        var tableModelsSql = [];

        for (var i = 0; i < this._tableModels.length; i++) {
            var tableModelSql = this._generateCreateTableModelSql(this._tableModels[i]);
            tableModelsSql.push(tableModelSql);
        }

        return tableModelsSql;
    },

    _generateCreateTableModelSql: function(tableModel) {
        var tableName = tableModel.Name;
        var createTableSql = "CREATE TABLE " + tableName + "(";


        for (var columnName in tableModel.Columns) {
            var column = tableModel.Columns[columnName];

            createTableSql += columnName + " " + column.SqlType + " ";
            createTableSql += column.isNullable() ? "NULL" : "NOT NULL";
            createTableSql += ", ";
        }

        createTableSql = createTableSql.substring(0, createTableSql.length - 2);
        createTableSql += "); GO;";

        return createTableSql;
    },

    _executeSql: function(transaction, sql, successHandler, errorHandler) {
        if (this._lastTransactionResult != "error") {
            transaction.executeSql(sql, [],
                    (function(transaction, result) {
                        this._executeSqlSuccessHandler(transaction, result, successHandler);
                    }).bind(this),
                    (function(transaction, result) {
                        this._executeSqlErrorHandler(transaction, result, errorHandler);
                    }).bind(this)
            );
        }
    },

    _executeSqlSuccessHandler: function(transaction, result, clientSuccessHandler) {
        this.log.info("[DatabaseInitializer.executeSqlSuccessHandler] - begin");
        this.log.info("[DatabaseInitializer.executeSqlSuccessHandler] - pending transactions %s", this._pendingTransactions);

        this._pendingTransactions--;
        if (this._pendingTransactions == 0) {
            this.log.info("[DatabaseInitializer.executeSqlSuccessHandler] - calling success callback");
            clientSuccessHandler();
        }
    },

    _executeSqlErrorHandler: function(transaction, result, clientErrorHandler) {
        this._lastTransactionResult = "error";
        clientErrorHandler(result);
    }
});

