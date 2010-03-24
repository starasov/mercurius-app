Models.GenericMapper = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "'tableModel' should be defined and can't be null.");
        this._tableModel = tableModel;
    },

    toModelResultSet: function(sqlResultSet) {
        Mojo.require(sqlResultSet, "'sqlResultSet' should be defined and can't be null.");
        return new Models.ResultSet(this._tableModel, sqlResultSet.rows);
    },

    toCountSql: function() {
        var countContext = {};

        countContext.sql = "SELECT COUNT(*) as count FROM " + this._tableModel.Name + ";";
        countContext.params = [];

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

        insertContext.sql = Models.GenericMapper._trimLastCommaAndSpace(insertContext.sql);
        insertContext.sql += ") VALUES(";

        for (column in this._tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this._tableModel.Columns[column];

            if (column != "id") {
                insertContext.sql += "?, ";
                insertContext.params.push(columnModel.toSqlType(value));
            }
        }

        insertContext.sql = Models.GenericMapper._trimLastCommaAndSpace(insertContext.sql);
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

        updateContext.sql = Models.GenericMapper._trimLastCommaAndSpace(updateContext.sql);
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
     * @return {hash} A select context with select sql statement string under
     *                'sql' key and query parameters array under 'params' key.
     */
    toSelectSql: function(searchParams) {
        var findContext = {};

        findContext.sql = "SELECT ";
        findContext.params = [];

        for (var column in this._tableModel.Columns) {
            findContext.sql += column + ", ";
        }

        findContext.sql = Models.GenericMapper._trimLastCommaAndSpace(findContext.sql);
        findContext.sql += " FROM " + this._tableModel.Name;

        if (Object.keys(searchParams).length > 0) {
            findContext.sql += " WHERE ";

            for (var parameter in searchParams) {
                var columnModel = this._tableModel.Columns[parameter];
                Mojo.require(columnModel, "Actual table model " + this._tableModel.Name + " desn't have " + parameter + " column defined.");

                findContext.sql += parameter + "=?, ";
                findContext.params.push(columnModel.toSqlType(searchParams[parameter]));
            }

            findContext.sql = Models.GenericMapper._trimLastCommaAndSpace(findContext.sql);
        }

        findContext.sql += ";";

        return findContext;
    }
});

/**
 * Remove last comma and space from sting.
 * For mapper internal use only.
 *
 * Note: actually the method removes last 2 characters from the end
 * and no extra checks are done here.
 *
 * @param str - {string} a string that ends with ", "
 * @return {string} A string with last 2 characters trimmed.
 *
 * @private
 * @static
 */
Models.GenericMapper._trimLastCommaAndSpace = function(str) {
    Mojo.require(str, "Passed string should be defined and can't be null.");
    Mojo.require(str.length > 2, "Passed string should contain more than 2 characters. Actual string length is " + str.length);
    
    return str.substring(0, str.length - 2); 
};