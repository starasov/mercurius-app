Models.Mapper = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel);
        this._tableModel = tableModel;
    },

    toCountSql: function() {
        return "SELECT COUNT(*) as count FROM " + this._tableModel.Name + ";";
    },

    toInsertSql: function(entity) {
        Mojo.require(entity);
        Mojo.require(entity.id == null || Object.isUndefined(entity.id));

        var insertContext = {};
        insertContext.sql = "INSERT INTO " + this._tableModel.Name + " (";
        insertContext.params = [];

        for (var column in this._tableModel.Columns) {
            if (column != "id") {
                insertContext.sql += column + ",";
            }
        }

        insertContext.sql = insertContext.sql.substring(0, sql.length - 1);
        insertContext.sql += ") VALUES(";

        for (column in this._tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this._tableModel.Columns[column];

            if (column != "id") {
                insertContext.sql += column + "?,";
                insertContext.params.push(columnModel.toSqlType(value));
            }
        }

        insertContext.sql = insertContext.sql.substring(0, sql.length - 1);
        insertContext.sql += ");";

        return insertContext;
    },

    toUpdateSql: function(entity) {
        Mojo.require(entity);
        Mojo.require(entity.id);

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

        updateContext.sql = updateContext.sql.substring(0, updateContext.sql.length - 2); // removing last comma and space
        updateContext.sql += " WHERE id=?;";
        updateContext.params.push(this._tableModel.Columns.id.toSqlType(entity.id));

        return updateContext;
    },

    toDeleteSql: function(id) {
    } 
});

Models.Mapper._isNull = function(value) {
    return Object.isUndefined(value) || value == null; 
};