Transactions.Mapper = Class.create(Database.BaseMapper, {
    findForAccount: function(account_id, limit, offset, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(Transactions.Mapper._findForAccountSql, [account_id, limit, offset],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    getCountSql: function() {
        return Transactions.Mapper._countSql;
    },

    getSaveSql: function() {
        return Transactions.Mapper._saveSql;
    },

    getUpdateSql: function() {
        return Transactions.Mapper._updateSql;
    },

    getDeleteSql: function() {
        return Transactions.Mapper._deleteSql;
    },

    getFindByIdSql: function() {
        return Transactions.Mapper._findByIdSql;
    },

    getFindAllSql: function() {
        return Transactions.Mapper._findAllSql;
    },

    getBaseColumns: function() {
        return Transactions.Mapper._baseColumns;
    }
});

Transactions.Mapper._baseColumns = ["amount", "date", "account_id", "category_id"];

Transactions.Mapper._countSql =
        "SELECT COUNT(*) as count FROM transactions;";

Transactions.Mapper._saveSql =
        "INSERT INTO transactions(amount, date, account_id, category_id) VALUES(?, ?, ?, ?);";

Transactions.Mapper._updateSql =
        "UPDATE transactions SET amount=?, date=?, account_id=?, category_id=? WHERE id=?;";

Transactions.Mapper._deleteSql =
        "DELETE FROM transactions WHERE id=?;";

Transactions.Mapper._baseFindSql =
        "SELECT t.id as id, t.amount as amount, t.date as date, t.account_id as account_id, t.category_id as category_id, " +
        "a.name as account_name, cat.name as category_name, cur.symbol as currency_symbol " +
        "FROM transactions t " +
        "LEFT JOIN accounts a ON t.account_id=a.id " +
        "LEFT JOIN categories cat ON t.category_id=cat.id " +
        "LEFT JOIN currencies cur ON a.currency_id=cur.id ";

Transactions.Mapper._findByIdSql =
        Transactions.Mapper._baseFindSql + "WHERE t.id=?;";

Transactions.Mapper._findAllSql =
        Transactions.Mapper._baseFindSql + "ORDER BY t.date LIMIT ? OFFSET ?;";

Transactions.Mapper._findForAccountSql =
        Transactions.Mapper._baseFindSql + "WHERE t.account_id=? ORDER BY t.date LIMIT ? OFFSET ?;";

