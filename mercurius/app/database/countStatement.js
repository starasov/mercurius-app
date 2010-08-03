Database.CountStatement = Class.create(Database.BaseLookupStatement, {
    toCountSql: function(searchParams) {
        var countContext = {};

        countContext.sql = "SELECT COUNT(*) as count FROM " + this.tableModel.Name;
        countContext.params = [];

        this._buildWhereClause(countContext, searchParams);

        countContext.sql += ";";

        return countContext;
    }
});
