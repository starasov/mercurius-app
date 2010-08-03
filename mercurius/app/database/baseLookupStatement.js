Database.BaseLookupStatement = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "'tableModel' parameter can't be null.");
        this.tableModel = tableModel;
    },

    /** @protected */
    _buildWhereClause: function(findContext, searchParams) {
        if (this._nonEmptyHash(searchParams)) {
            findContext.sql += " WHERE ";

            for (var parameter in searchParams) {
                var columnModel = this.tableModel.Columns[parameter];
                Mojo.require(columnModel, "Actual table model " + this.tableModel.Name + " desn't have " + parameter + " column defined.");
                findContext.sql += parameter + "=? AND ";
                findContext.params.push(columnModel.toSqlType(searchParams[parameter]));
            }

            findContext.sql = Utils.StringUtils.trimLast(findContext.sql, " AND ");
        }
    },

    /** @protected */
    _nonEmptyHash: function(hash) {
        return Object.keys(hash).length > 0;
    }
});
