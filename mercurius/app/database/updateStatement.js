Database.UpdateStatement = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "'tableModel' parameter can't be null.");
        this.tableModel = tableModel;
    },

    toUpdateSql: function(entity) {
        Mojo.require(entity, "'entity' to update should be defined and can't be null.");
        Mojo.require(entity.id, "Passed 'entity' should have 'id' value to be updated.");

        var updateContext = {};
        updateContext.sql = "UPDATE " + this.tableModel.Name + " SET ";
        updateContext.params = [];

        for (var column in this.tableModel.Columns) {
            var value = Object.isUndefined(entity[column]) ? null : entity[column];
            var columnModel = this.tableModel.Columns[column];

            if (column != "id") {
                updateContext.sql += column + "=?, ";
                updateContext.params.push(columnModel.toSqlType(value));
            }
        }

        updateContext.sql = Utils.StringUtils.trimLast(updateContext.sql, ", ");
        updateContext.sql += " WHERE id=?;";
        updateContext.params.push(this.tableModel.Columns.id.toSqlType(entity.id));

        return updateContext;
    }
});