Transactions.SelectStatement = Class.create(Database.SelectStatement, {
    /**
     * @protected
     * @override
     */
    _getSelectColumns: function($super) {
        return $super().concat([
            this._toSelectColumnName(Accounts.TableModel, "name", "account_name"),
            this._toSelectColumnName(Categories.TableModel, "name", "category_name")
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

        findContext.sql += " LEFT JOIN " + accounts + " ON " + transactions + ".account_id = " + accounts + ".id";
        findContext.sql += " LEFT JOIN " + categories + " ON " + transactions + ".category_id = " + categories + ".id";
    }
});