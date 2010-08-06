Models.GenericMapper = Class.create({
    log: Utils.NullLog,

    initialize: function(tableModel) {
        Mojo.require(tableModel, "Table model should be defined and can't be null.");
        this.tableModel = tableModel;
    },

    mapRow: function(row, successCallback, errorCallback) {
        var model = {};

        this._mapOriginColumns(row, model);
        this._mapForeignColumns(row, model);

        this.log.info("[Models.GenericMapper.mapRow] - mapped model: %j", model);
        
        successCallback(model);
    },

    _mapOriginColumns: function(row, model) {
        for (var column in this.tableModel.Columns) {
            var columnType = this.tableModel.Columns[column];
            model[column] = columnType.fromSqlType(row[column]);
        }
    },

    _mapForeignColumns: function(row, model) {
        var foreignColumns = this.tableModel.ForeignColumns || {};

        for (var column in foreignColumns) {
            var foreignColumn = foreignColumns[column];
            var columnType = foreignColumn();
            model[column] = columnType.fromSqlType(row[column]);
        }
    }
});