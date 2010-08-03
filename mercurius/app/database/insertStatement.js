Database.InsertStatement = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "'tableModel' parameter can't be null.");
        this.tableModel = tableModel;
    },

    toInsertSql: function(entity) {
        Mojo.require(entity, "'entity' to insert should be defined and can't be null.");
        Mojo.require(entity.id == null || Object.isUndefined(entity.id), "Can't insert entity - entity has id value specified: id=" + entity.id);

        var insertContext = {};
        insertContext.sql = "INSERT INTO " + this.tableModel.Name + " (";
        insertContext.params = [];

        for (var column in this.tableModel.Columns) {
            if (column != "id") {
                insertContext.sql += column + ", ";
            }
        }

        insertContext.sql = Utils.StringUtils.trimLast(insertContext.sql, ", ");
        insertContext.sql += ") VALUES(";

        for (column in this.tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this.tableModel.Columns[column];

            if (column != "id") {
                insertContext.sql += "?, ";
                insertContext.params.push(columnModel.toSqlType(value));
            }
        }

        insertContext.sql = Utils.StringUtils.trimLast(insertContext.sql, ", ");
        insertContext.sql += ");";

        return insertContext;
    }
});