Accounts.Mapper = Class.create(Database.BaseMapper, {
    findAllWithBalance: function(limit, offset, successCallback, errorCallback) {
        var findSql = (new Template(Accounts.Mapper._findWithBalanceTemplate)).evaluate({where: ''});
        this.db.transaction((function(transaction) {
            transaction.executeSql(findSql, [limit, offset],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    findOpenWithBalance: function(limit, offset, successCallback, errorCallback) {
        var findSql = new Template(Accounts.Mapper._findWithBalanceTemplate).evaluate({where: 'WHERE a.closed_flag=?'});
        this.db.transaction((function(transaction) {
            transaction.executeSql(findSql, [0, limit, offset],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    getCountSql: function() {
        return Accounts.Mapper._countSql;
    },

    getSaveSql: function() {
        return Accounts.Mapper._saveSql;
    },

    getUpdateSql: function() {
        return Accounts.Mapper._updateSql;
    },

    getDeleteSql: function() {
        return Accounts.Mapper._deleteSql;
    },

    getFindByIdSql: function() {
        return Accounts.Mapper._findByIdSql;
    },

    getFindAllSql: function() {
        return Accounts.Mapper._findAllSql;
    },

    getBaseColumns: function() {
        return Accounts.Mapper._baseColumns;
    },

    /** @protected */
    _mapRow: function($super, row) {
        var account = $super(row);
        account.balance = account.opening_balance + account.transactions_balance;
        return account;
    }
});

Accounts.Mapper._baseColumns = ["name", "opening_balance", "currency_id", "closed_flag"];

Accounts.Mapper._countSql =
        "SELECT COUNT(*) as count FROM accounts;";

Accounts.Mapper._saveSql =
        "INSERT INTO accounts(name, opening_balance, currency_id, closed_flag) VALUES(?, ?, ?, ?);";

Accounts.Mapper._updateSql =
        "UPDATE accounts SET name=?, opening_balance=?, currency_id=?, closed_flag=? WHERE id=?;";

Accounts.Mapper._deleteSql =
        "DELETE FROM accounts WHERE id=?;";

Accounts.Mapper._findAllSql =
        "SELECT id, name, opening_balance, currency_id, closed_flag FROM accounts ORDER BY closed_flag, name LIMIT ? OFFSET ?;";

Accounts.Mapper._baseFindWithBalanceSql =
        "SELECT a.id, a.name, a.opening_balance, a.currency_id, a.closed_flag, c.symbol as currency_symbol, c.name as currency_name, t.transactions_balance FROM accounts a " +
        "LEFT JOIN (SELECT account_id, SUM(amount) AS transactions_balance FROM transactions GROUP BY account_id) t ON a.id = t.account_id " +
        "LEFT JOIN currencies c ON c.id = a.currency_id ";

Accounts.Mapper._findByIdSql =
        Accounts.Mapper._baseFindWithBalanceSql + "WHERE a.id=?;";

Accounts.Mapper._findWithBalanceTemplate =
        Accounts.Mapper._baseFindWithBalanceSql + "#{where} ORDER BY a.closed_flag, a.name LIMIT ? OFFSET ?;";


