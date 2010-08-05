Database.SelectStatement = Class.create(Database.BaseLookupStatement, {
    /**
     * Generates simple select sql statement using passed parameters hash.
     *
     * The method doesn't support any "extra" functionality like <, >, 'like'
     * operators and grouping and ordering functionality (seems like todo items
     * here).
     *
     * @param searchParams - {hash} a hash with select parameters. If 'undefined'
     *                       or 'null' is passed then no where part is generated
     *                       and all records in the table will be returned.
     *
     * @param extraParams - {hash} a hash with some extra search query parameters.
     *                      Following extra parameters are supported: 'order', 'limit'
     *                      and offset.
     *
     * @return {hash} A select context with select sql statement string under
     *                'sql' key and query parameters array under 'params' key.
     */
    toSelectSql: function(searchParams, extraParams) {
        var findContext = {};

        this._buildSelectFromClause(findContext);
        this._buildJoinClause(findContext, extraParams);
        this._buildWhereClause(findContext, searchParams);
        this._buildGroupByClause(findContext, extraParams);
        this._buildOrderAndLimitClause(findContext, extraParams);

        findContext.sql += ";";

        return findContext;
    },

    /** @protected */
    _buildSelectFromClause: function(findContext) {
        findContext.sql = "SELECT ";
        findContext.params = [];

        var columns = this._getSelectColumns();
        for (var i = 0; i < columns.length; i++) {
            findContext.sql += columns[i] + ", ";
        }

        findContext.sql = Utils.StringUtils.trimLast(findContext.sql, ", ");
        findContext.sql += " FROM " + this.tableModel.Name;
    },

    /** @protected */
    _getSelectColumns: function() {
        var columns = [];

        for (var columnName in this.tableModel.Columns) {
            columns.push(this._toSelectColumnName(this.tableModel, columnName));
        }

        return columns;
    },

    /** @protected */
    _buildJoinClause: function(findContext, extraParams) {
    },

    /**
     * Creates ORDER BY and LIMIT + OFFSET sql clauses.
     *
     * Passed findContext parameter will be updated with generated
     * sql and query parameters.
     *
     * @param findContext - {hash} a previously created select context
     *                             with 'sql' and 'params' keys.
     *
     * @param extraParams - {hash} a hash with ORDER BY, LIMIT and OFFSET
     *                             values. Lookup of following keys are done
     *                             here: 'order', 'limit' and 'offset'.
     *
     * @protected
     */
    _buildOrderAndLimitClause: function(findContext, extraParams) {
        if (extraParams) {
            findContext.sql += " ";

            if (extraParams.order) {
                Mojo.require(this.tableModel.Columns[extraParams.order], "Table model should contain '" + extraParams.order + "' column.");
                findContext.sql += "ORDER BY " + this._toFullColumnName(extraParams.order) + " ";
            }

            if (Object.isNumber(extraParams.limit)) {
                findContext.sql += "LIMIT ?";
                findContext.params.push(extraParams.limit);

                if (Object.isNumber(extraParams.offset)) {
                    findContext.sql += " OFFSET ?";
                    findContext.params.push(extraParams.offset);
                }
            }

            findContext.sql = Utils.StringUtils.trimLast(findContext.sql, ", ");
        }
    },

    /** @protected */
    _buildGroupByClause: function(findContext, extraParams) {
        if (extraParams && extraParams.group) {
            Mojo.require(this.tableModel.Columns[extraParams.group], "Table model should contain '" + extraParams.group + "' column.");
            findContext.sql += " GROUP BY ";
            findContext.sql += this._toFullColumnName(extraParams.group);
            findContext.sql += " ";
        }
    },

    /** @protected */
    _toSelectColumnName: function(tableModel, column, asColumn) {
        return tableModel.Name + "." + column + " AS " + (asColumn || column);
    }
});