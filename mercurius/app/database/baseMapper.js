Database.BaseMapper = Class.create({
    initialize: function(db) {
        Mojo.require(db, "'db' paramater can't be null or undefined");
        this.db = db;
    },

    count: function(successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(this.getCountSql(), [], function(_, resultSet) {
                successCallback(resultSet.rows.item(0).count);
            }, errorCallback)
        }).bind(this));
    },

    save: function(model, successCallback, errorCallback) {
        Mojo.require(model, "Model can't be be null or undefined.");
        Mojo.requireFalse(model.id, "Model id should be null or undefined. Use update method instead.");

        this.db.transaction((function(transaction) {
            var params = this._createParamsFromModel(model);
            transaction.executeSql(this.getSaveSql(), params, function(_, resultSet) {
                successCallback(resultSet.insertId);
            }, errorCallback);
        }).bind(this));
    },

    update: function(model, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            this._update(model, transaction, successCallback, errorCallback);
        }).bind(this));
    },

    saveOrUpdate: function(model, successCallback, errorCallback) {
        Mojo.require(model, "Model can't be be null or undefined.");

        if (model.id) {
            this.update(model, successCallback, errorCallback);
        } else {
            this.save(model, successCallback, errorCallback);
        }
    },

    deleteById: function(id, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(this.getDeleteSql(), [id], function(_, resultSet) {
                successCallback(resultSet.rowsAffected);
            }, errorCallback);
        }).bind(this));
    },

    findById: function(id, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            this._findById(id, transaction, successCallback, errorCallback);
        }).bind(this));
    },

    findAll: function(limit, offset, successCallback, errorCallback) {
        Mojo.requireNumber(limit, "Limit should be a number.");
        Mojo.requireNumber(offset, "Offset should be a number.");

        if (limit == 0) {
            Mojo.Log.warn("[Database.BaseMapper.findAll] - passed limit is 0. Probably you've switched limit and offset parameters.");
        }

        this.db.transaction((function(transaction) {
            transaction.executeSql(this.getFindAllSql(), [limit, offset],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    getCountSql: function() {
        Mojo.require(false, "Not implemented.");
    },

    getSaveSql: function() {
        Mojo.require(false, "Not implemented.");
    },

    getUpdateSql: function() {
        Mojo.require(false, "Not implemented.");
    },

    getDeleteSql: function() {
        Mojo.require(false, "Not implemented.");
    },

    getFindAllSql: function() {
        Mojo.require(false, "Not implemented.");
    },

    getFindByIdSql: function() {
        Mojo.require(false, "Not implemented.");
    },

    getBaseColumns: function() {
        Mojo.require(false, "Not implemented.");
    },

    /** @protected */
    _createLazyTransaction: function() {
        return new Database.Transaction(this.db);
    },

    /** @protected */
    _findById: function(id, transaction, successCallback, errorCallback) {
        transaction.executeSql(this.getFindByIdSql(), [id],
                this._handleSingleResult.bind(this, successCallback), errorCallback);
    },

    /** @protected */
    _update: function(model, transaction, successCallback, errorCallback) {
        Mojo.require(model, "Model can't be be null or undefined.");
        Mojo.require(model.id, "Model id can't be be null or undefined. Use save method instead.");

        var params = this._createParamsFromModel(model);
        transaction.executeSql(this.getUpdateSql(), params.concat([model.id]), function(_, resultSet) {
            successCallback(model.id);
        }, errorCallback);
    },

    /** @protected */
    _createParamsFromModel: function(account) {
        var params = [];

        this.getBaseColumns().each(function(column) {
            params.push(account[column]);
        });

        return params;
    },

    /** @protected */
    _handleSingleResult: function(successCallback, transaction, resultSet) {
        var rows = resultSet.rows;
        if (rows.length == 0) {
            successCallback(null);
        } else {
            successCallback(this._mapRow(rows.item(0)));
        }
    },

    /** @protected */
    _handleMultipleResults: function(successCallback, transaction, resultSet) {
        var rows = resultSet.rows;
        var results = [];

        for (var i = 0; i < rows.length; i++) {
            var row = rows.item(i);
            results.push(this._mapRow(row));
        }

        successCallback(results);
    },

    /** @protected */
    _mapRow: function(row) {
        var result = {};

        for (var column in row) {
            result[column] = row[column];
        }

        return result;
    }
});
