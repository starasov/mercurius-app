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

        var sql = "INSERT INTO " + this._tableModel.Name + " (";

        for (var column in this._tableModel.Columns) {
            sql += column + ",";
        }

        sql = sql.substring(0, sql.length - 1);
        sql += ") VALUES(";

        for (column in this._tableModel.Columns) {
            var value = entity[column];
            var columnModel = this._tableModel.Columns[column];

            if (column == "id" && Models.Mapper._isNull(value)) {
                continue;
            }

            sql += (Models.Mapper._isNull(value) ? "NULL" : columnModel.toSql(value));
            sql += ","
        }

        sql = sql.substring(0, sql.length - 1); // removing last comma
        sql += ");";

        return sql;
    },

    toUpdateSql: function(entity) {
        Mojo.require(entity);
        Mojo.require(entity.id);

        var updateContext = {};
        updateContext.sql = "UPDATE " + this._tableModel.Name + " SET ";
        updateContext.params = [];

        for (var column in this._tableModel.Columns) {
            var value = Object.isUndefined(value) ? null : entity[column];
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