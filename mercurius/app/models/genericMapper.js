Models.GenericMapper = Class.create({
    initialize: function(tableModel) {
        Mojo.require(tableModel, "Table model should be defined and can't be null.");
        this.tableModel = tableModel;
    },

    mapRow: function(row, successCallback, errorCallback) {
        var model = {};

        for (var column in this.tableModel.Columns) {
            var columnType = this.tableModel.Columns[column];
            model[column] = columnType.fromSqlType(row[column]);
        }

        successCallback(model);
    }
});