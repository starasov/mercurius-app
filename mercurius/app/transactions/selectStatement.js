Transactions.SelectStatement = Class.create(Database.SelectStatement, {
    /**
     * @protected
     * @override
     */
    _getSelectColumns: function($super) {
        return $super().concat([
            this._toSelectColumnName(Accounts.TableModel, "name", "account_name"),
            this._toSelectColumnName(Categories.TableModel, "name", "category_name"),
            this._toSelectColumnName(Categories.TableModel, "type", "category_type"),
            this._toSelectColumnName(Currencies.TableModel, "symbol", "currency_symbol")
        ]);
    },

    /**
     * @protected
     * @override
     */
    _buildJoinClause: function(findContext, extraParams) {
        var transactions = Transactions.TableModel.Name;
        var accounts = Accounts.TableModel.Name;
        var categories = Categories.TableModel.Name;
        var currencies = Currencies.TableModel.Name;

        findContext.sql += " LEFT JOIN " + accounts + " ON " + transactions + ".account_id = " + accounts + ".id";
        findContext.sql += " LEFT JOIN " + categories + " ON " + transactions + ".category_id = " + categories + ".id";
        findContext.sql += " LEFT JOIN " + currencies + " ON " + accounts + ".currency_id = " + currencies + ".id";
    }
});