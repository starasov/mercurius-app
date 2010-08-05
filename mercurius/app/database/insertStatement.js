Database.InsertStatement = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "'tableModel' parameter can't be null.");
        this.tableModel = tableModel;
    },

    toInsertSql: function(model) {
        Mojo.require(model, "'model' to insert should be defined and can't be null.");
        Mojo.require(model.id == null || Object.isUndefined(model.id), "Can't insert entity - entity has id value specified: id=" + model.id);

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
            var value = Object.isUndefined(model[column]) ? null : model[column];
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