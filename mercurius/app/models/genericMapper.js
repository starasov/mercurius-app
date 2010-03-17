Models.Mapper = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "Table model should be defined and can't be null.");
        this._tableModel = tableModel;
    },

    toCountSql: function() {
        var countContext = {};

        countContext.sql = "SELECT COUNT(*) as count FROM " + this._tableModel.Name + ";";
        countContext.params = [];

        return countContext;
    },

    toInsertSql: function(entity) {
        Mojo.require(entity, "Entity to insert should be defined and can't be null.");
        Mojo.require(entity.id == null || Object.isUndefined(entity.id), "Can't insert entity - entity has id value specified: id=" + entity.id);

        var insertContext = {};
        insertContext.sql = "INSERT INTO " + this._tableModel.Name + " (";
        insertContext.params = [];

        for (var column in this._tableModel.Columns) {
            if (column != "id") {
                insertContext.sql += column + ", ";
            }
        }

        insertContext.sql = Models.Mapper._trimLastCommaAndSpace(insertContext.sql);
        insertContext.sql += ") VALUES(";

        for (column in this._tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this._tableModel.Columns[column];

            if (column != "id") {
                insertContext.sql += "?, ";
                insertContext.params.push(columnModel.toSqlType(value));
            }
        }

        insertContext.sql = Models.Mapper._trimLastCommaAndSpace(insertContext.sql);
        insertContext.sql += ");";

        return insertContext;
    },

    toUpdateSql: function(entity) {
        Mojo.require(entity, "Entity to update should be defined and can't be null.");
        Mojo.require(entity.id, "Passed entity should have id value to be updated.");

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

        updateContext.sql = Models.Mapper._trimLastCommaAndSpace(updateContext.sql);
        updateContext.sql += " WHERE id=?;";
        updateContext.params.push(this._tableModel.Columns.id.toSqlType(entity.id));

        return updateContext;
    },

    toDeleteSql: function(id) {
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
Models.Mapper._trimLastCommaAndSpace = function(str) {
    Mojo.require(str, "Passed string should be defined and can't be null.");
    Mojo.require(str.length > 2, "Passed string should contain more than 2 characters. Actual string length is " + str.length);
    
    return str.substring(0, str.length - 2); 
};