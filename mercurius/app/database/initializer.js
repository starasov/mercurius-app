Database.Initializer = Class.create({
    log: Utils.NullLog,
    
    initialize: function() {
        this._tableModels = [];
        this._postCreateStatements = [];
    },

    addTableModel: function(tableModel) {
        this._tableModels.push(tableModel);
    },

    addPostCreateSqlStatement: function(statement) {
        Mojo.requireString(statement, "Passed 'statement' parameter should be string type.");
        this._postCreateStatements.push(statement);
    },

    initializeDatabase: function(db, successCallback, errorCallback) {
        Mojo.requireFunction(successCallback, "[Database.Initializer.initialize] - 'successCallback' parameter should be a function.");
        Mojo.requireFunction(errorCallback, "[Database.Initializer.initialize] - 'errorCallback' parameter should be a function.");

        var statements = this._generateDropTableModelsSql().concat(this._generateCreateTableModelsSql());
        statements = statements.concat(this._postCreateStatements);

        var transaction = new Database.Transaction(db);

        for (var i =  0; i < statements.length; i++) {
            transaction.addCommand(this._executeSql.bind(this, statements[i]));
        }

        transaction.execute(successCallback, errorCallback);
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

    _executeSql: function(sql, transaction, successHandler, errorHandler) {
        transaction.executeSql(sql, [], successHandler, errorHandler);
    }
});

