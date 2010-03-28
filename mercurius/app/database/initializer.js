Database.Initializer = function() {
    this._tableModels = [];
    this._pendingTransactions = 0;
    this._lastTransactionResult = "success";
};

Database.Initializer.prototype.addTableModel = function(tableModel) {
    this._tableModels.push(tableModel);
};

Database.Initializer.prototype.initialize = function(db, successHandler, errorHandler) {
    Mojo.Log.info("[DatabaseInitializer.initialize] - begin");

    Mojo.requireFunction(successHandler);
    Mojo.requireFunction(errorHandler);

    var tableModelsSql = this._generateDropTableModelsSql().concat(this._generateCreateTableModelsSql());
    this._pendingTransactions = tableModelsSql.length;
    Mojo.Log.info("[DatabaseInitializer.initialize] - this.pendingTransactions: %s", this._pendingTransactions);

    for (var i =  0; i < tableModelsSql.length; i++) {
        Mojo.Log.info("[DatabaseInitializer.initialize] - is about to execute (inner): %s", tableModelsSql[i]);

        var sql = tableModelsSql[i];
        db.transaction((function(sql, transaction) {
            Mojo.Log.info("[DatabaseInitializer.initialize] - is about to execute (outer): %s", sql);
            this._executeSql(transaction, sql, successHandler, errorHandler);
        }).bind(this, sql));
    }

    Mojo.Log.info("[DatabaseInitializer.initialize] - end");
};

Database.Initializer.prototype._generateDropTableModelsSql = function() {
    var dropTableModelsSql = [];

    for (var i = 0; i < this._tableModels.length; i++) {
        dropTableModelsSql.push("DROP TABLE IF EXISTS " + this._tableModels[i].Name + "; GO;");
    }

    return dropTableModelsSql;
};

Database.Initializer.prototype._generateCreateTableModelsSql = function() {
    var tableModelsSql = [];

    for (var i = 0; i < this._tableModels.length; i++) {
        var tableModelSql = this._generateCreateTableModelSql(this._tableModels[i]);
        tableModelsSql.push(tableModelSql);
    }

    return tableModelsSql;
};

Database.Initializer.prototype._generateCreateTableModelSql = function(tableModel) {
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
};

Database.Initializer.prototype._executeSql = function(transaction, sql, successHandler, errorHandler) {
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
};

Database.Initializer.prototype._executeSqlSuccessHandler = function(transaction, result, clientSuccessHandler) {
    Mojo.Log.info("[DatabaseInitializer.executeSqlSuccessHandler] - begin");
    Mojo.Log.info("[DatabaseInitializer.executeSqlSuccessHandler] - pending transactions %s", this._pendingTransactions);

    this._pendingTransactions--;
    if (this._pendingTransactions == 0) {
        Mojo.Log.info("[DatabaseInitializer.executeSqlSuccessHandler] - calling success callback");
        clientSuccessHandler();
    }
};

Database.Initializer.prototype._executeSqlErrorHandler = function(transaction, result, clientErrorHandler) {
    this._lastTransactionResult = "error";
    clientErrorHandler(result);
};