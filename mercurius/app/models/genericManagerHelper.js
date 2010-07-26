Models.GenericManagerHelper = Class.create({
    /**
     * Constructs mapper instance.
     *
     * @param tableModel - {hash} (required) a table model descriptor.
     */
    initialize: function(tableModel) {
        Mojo.require(tableModel, "'tableModel' should be defined and can't be null.");
        this._tableModel = tableModel;
    },

    toCountSql: function(searchParams) {
        var countContext = {};

        countContext.sql = "SELECT COUNT(*) as count FROM " + this._tableModel.Name;
        countContext.params = [];

        this._buildWhereClause(countContext, searchParams);

        countContext.sql = this._trimLastCommaAndSpace(countContext.sql) + ";";

        return countContext;
    },

    toInsertSql: function(entity) {
        Mojo.require(entity, "'entity' to insert should be defined and can't be null.");
        Mojo.require(entity.id == null || Object.isUndefined(entity.id), "Can't insert entity - entity has id value specified: id=" + entity.id);

        var insertContext = {};
        insertContext.sql = "INSERT INTO " + this._tableModel.Name + " (";
        insertContext.params = [];

        for (var column in this._tableModel.Columns) {
            if (column != "id") {
                insertContext.sql += column + ", ";
            }
        }

        insertContext.sql = this._trimLastCommaAndSpace(insertContext.sql);
        insertContext.sql += ") VALUES(";

        for (column in this._tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this._tableModel.Columns[column];

            if (column != "id") {
                insertContext.sql += "?, ";
                insertContext.params.push(columnModel.toSqlType(value));
            }
        }

        insertContext.sql = this._trimLastCommaAndSpace(insertContext.sql);
        insertContext.sql += ");";

        return insertContext;
    },

    toUpdateSql: function(entity) {
        Mojo.require(entity, "'entity' to update should be defined and can't be null.");
        Mojo.require(entity.id, "Passed 'entity' should have 'id' value to be updated.");

        var updateContext = {};
        updateContext.sql = "UPDATE " + this._tableModel.Name + " SET ";
        updateContext.params = [];

        for (var column in this._tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this._tableModel.Columns[column]; 

            if (column != "id") {
                updateContext.sql += column + "=?, ";
                updateContext.params.push(columnModel.toSqlType(value));
            }
        }

        updateContext.sql = this._trimLastCommaAndSpace(updateContext.sql);
        updateContext.sql += " WHERE id=?;";
        updateContext.params.push(this._tableModel.Columns.id.toSqlType(entity.id));

        return updateContext;
    },

    /**
     * Generates delete sql statement using passed 'id' parameter.
     *
     * @param id - {number} an entity id to be deleted.
     *
     * @return {hash} A delete context with delete sql statement string under
     *                'sql' key and query parameters array under 'params' key.
     */
    toDeleteSql: function(id) {
        Mojo.requireNumber(id, "Passed 'id' should be defined and can't be null.");

        var deleteContext = {};

        deleteContext.sql =  "DELETE FROM " + this._tableModel.Name + " WHERE id=?;";
        deleteContext.params = [id];

        return deleteContext;
    },

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

        findContext.sql = "SELECT ";
        findContext.params = [];

        for (var column in this._tableModel.Columns) {
            findContext.sql += column + ", ";
        }

        findContext.sql = this._trimLastCommaAndSpace(findContext.sql);
        findContext.sql += " FROM " + this._tableModel.Name;

        this._buildWhereClause(findContext, searchParams);
        this._buildGroupByClause(findContext, extraParams);
        this._buildOrderAndLimitClause(findContext, extraParams);

        findContext.sql += ";";

        return findContext;
    },

    _buildWhereClause: function(findContext, searchParams) {
        if (this._nonEmptyHash(searchParams)) {
            findContext.sql += " WHERE ";

            for (var parameter in searchParams) {
                var columnModel = this._tableModel.Columns[parameter];
                Mojo.require(columnModel, "Actual table model " + this._tableModel.Name + " desn't have " + parameter + " column defined.");
                findContext.sql += parameter + "=? AND ";
                findContext.params.push(columnModel.toSqlType(searchParams[parameter]));
            }

            findContext.sql = this._trimLastString(findContext.sql, " AND ");
        }
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
     * @private
     */
    _buildOrderAndLimitClause: function(findContext, extraParams) {
        if (extraParams) {
            findContext.sql += " ";
            
            if (extraParams.order) {
                Mojo.require(this._tableModel.Columns[extraParams.order], "Table model should contain '" + extraParams.order + "' column.");
                findContext.sql += "ORDER BY " + extraParams.order + " ";
            }

            if (Object.isNumber(extraParams.limit)) {
                findContext.sql += "LIMIT ?";
                findContext.params.push(extraParams.limit);

                if (Object.isNumber(extraParams.offset)) {
                    findContext.sql += " OFFSET ?";
                    findContext.params.push(extraParams.offset);
                }
            }
            
            findContext.sql = this._trimLastCommaAndSpace(findContext.sql);
        }
    },

    _buildGroupByClause: function(findContext, extraParams) {
        if (extraParams && extraParams.group) {
            Mojo.require(this._tableModel.Columns[extraParams.group], "Table model should contain '" + extraParams.group + "' column.");
            findContext.sql += " GROUP BY ";
            findContext.sql += extraParams.group;
            findContext.sql += " ";
        }
    },

    /**
     * Remove last comma and space from sting.
     * Note: for mapper internal use only.
     *
     * @param str - {string} a string that ends with ", "
     * @return {string} A string with last ", " characters trimmed.
     *
     * @private
     */
    _trimLastCommaAndSpace: function(str) {
        Mojo.require(str, "Passed string should be defined and can't be null.");
        Mojo.require(str.length > 2, "Passed string should contain more than 2 characters. Actual string length is " + str.length);

        var index = str.lastIndexOf(", ");
        var result = (index == str.length - 2) ? str.substring(0, str.length - 2) : str;
        
        return result.trim();
    },

    _trimLastString: function(str, substr) {
        var index = str.lastIndexOf(substr);
        var result = (index == str.length - substr.length) ? str.substring(0, str.length - substr.length) : str;
        return result.trim();
    },

    _nonEmptyHash: function(hash) {
        return Object.keys(hash).length > 0;
    }
});

