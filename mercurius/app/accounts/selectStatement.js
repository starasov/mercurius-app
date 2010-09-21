Accounts.SelectStatement = Class.create(Database.SelectStatement, {
    /**
     * @protected
     * @override
     */
    _getSelectColumns: function($super) {
        return $super().concat([
            this._toSelectColumnName(Currencies.TableModel, "name", "currency_name"),
            this._toSelectColumnName(Currencies.TableModel, "symbol", "currency_symbol")
        ]);
    },

//    SELECT a.id, a.name, t.sum FROM accounts a
//        LEFT JOIN (SELECT account_id, SUM(amount) AS sum FROM transactions GROUP BY account_id) t
//          ON a.id = t.account_id

    /**
     * @protected
     * @override
     */
    _buildJoinClause: function(findContext, extraParams) {
        var currencies = Currencies.TableModel.Name;
        var accounts = Accounts.TableModel.Name; 
        findContext.sql += " LEFT JOIN " + currencies + " ON " + accounts + ".currency_id = " + currencies + ".id" ;
    }
});