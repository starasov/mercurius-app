Transactions.Manager = Class.create(Models.GenericManager, {
    /** @protected */
    _createSelectStatement: function() {
        return new Transactions.SelectStatement(this.tableModel);
    }
});