Models.ResultSet = Class.create({
    initialize: function(tableModel, sqlResultSetRows) {
        Mojo.require(tableModel, "'tableModel' parameter should be defined and can't be null.");
        Mojo.require(sqlResultSetRows, "'sqlResultSet' parameter should be defined and can't be null.");

        this._tableModel = tableModel;
        this._sqlResultSetRows = sqlResultSetRows;

    },

    length: function() {
        return this._sqlResultSetRows.length
    },

    item: function(index) {
        var result = this._sqlResultSetRows.item(index);

        var model = {};

        for (var column in this._tableModel.Columns) {
            var columnType = this._tableModel.Columns[column];
            model[column] = columnType.fromSqlType(result[column]); 
        }

        return model;
    }
});