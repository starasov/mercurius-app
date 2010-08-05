Models.GenericManager = Class.create({
    log: Mojo.Log,
    
    /**
     * Initializes generic manager instance.
     *
     * Generic manager is data access object (in some degree). It contains
     * a set of generic methods to work with particular table model. It gives
     * access to manager client to delete, count, insert and update instances
     * of particular table model entities.
     *
     * @param db - {Database} an initialized database instance.
     * @param resultSetMapper - {Database.ResultSetMapper} a sql result set mapper
     *                          for particular model.
     */
    initialize: function(db, tableModel, resultSetMapper) {
        Mojo.require(db, "Database should be defined and can't be null.");
        Mojo.require(tableModel, "Table model should be defined and can't be null.");
        Mojo.require(resultSetMapper, "Result Set Mapper should be defined and can't be null.");


        this.db = db;
        this.tableModel = tableModel;
        this.resultSetMapper = resultSetMapper;
    },

    /**
     * Retrieves actual records count in the table.
     *
     * @param successCallback - {callback} (transaction, count) a callback receives
     * actual transaction and table rows count.
     *
     * @param errorCallback - {callback} (transaction, error) a callback receives error
     * notification in case if something went wrong with counts.
     */
    count: function(searchParameters, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            var countContext = this._createCountStatement().toCountSql(searchParameters);
            transaction.executeSql(countContext.sql, countContext.params,
                    function(innerTransaction, resultSet) {
                        successCallback(resultSet.rows.item(0).count)
                    }, errorCallback);
        }).bind(this));
    },

    /**
     * Inserts new record in the table.
     *
     * @param successCallback - {callback} (transaction, id) a callback receives
     * actual transaction and new id of inserted item.
     *
     * @param errorCallback - {callback} (transaction, error) a callback receives error
     * notification in case if something went wrong with counts.
     */
    save: function(model, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            var insertContext = this._createInsertStatement().toInsertSql(model);
            transaction.executeSql(insertContext.sql, insertContext.params,
                    function(innerTransaction, resultSet) {
                        successCallback(resultSet.insertId)
                    }, errorCallback);
        }).bind(this));
    },

    /**
     * Updates existing record in the table with new data.
     *
     * @param successCallback - {callback} (transaction, resultSet) a callback receives
     * actual transaction and updates items count.
     *
     * @param errorCallback - {callback} (transaction, error) a callback receives error
     * notification in case if something went wrong with insert.
     */
    update: function(model, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            this._update(model, transaction, successCallback, errorCallback);
        }).bind(this));
    },

    saveOrUpdate: function(model, successCallback, errorCallback) {
        if (model.id) {
            this.update(model, successCallback, errorCallback);
        } else {
            this.save(model, successCallback, errorCallback);
        }
    },

    /**
     * Deletes record by specified id from the table.
     *
     * @param id - {number} an entity id to be deleted.
     * @param successCallback - {callback} (transaction, resultSet) a successful deletion callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    deleteById: function(id, successCallback, errorCallback) {
        Mojo.requireNumber(id, "id parameter should be a number.");

        this.db.transaction((function(transaction) {
            var deleteContext = this._createDeleteStatement().toDeleteSql(id);
            transaction.executeSql(deleteContext.sql, deleteContext.params, function(innerTransaction, resultSet) {
                successCallback(resultSet.rowsAffected);
            }, errorCallback);
        }).bind(this));
    },

    /**
     * Searches for particular record by specified id.
     *
     * @param id - {number} an entity id to be searched for.
     * @param successCallback - {callback} (transaction, Models.ResultSet) a successful search callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    findById: function(id, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            this._findById(id, transaction, successCallback, errorCallback);
        }).bind(this));
    },

    /**
     * Searches for all available records in the table.
     *
     * @param successCallback - {callback} (transaction, Models.ResultSet) a successful search callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    all: function(extraParameters, successCallback, errorCallback) {
        this.find({}, extraParameters, successCallback, errorCallback);
    },

    /**
     * Searches for records that match passed search parameters.
     *
     * @param searchParameters - {hash} a hash with select parameters. If 'undefined'
     *                           or 'null' is passed then no where part is generated
     *                           and all records in the table will be returned.
     *
     * @param extraParameters - {hash} a hash with some extra search query parameters.
     *                          Following extra parameters are supported: 'order', 'limit'
     *                          and offset.
     * 
     * @param successCallback - {callback} (transaction, Models.ResultSet) a successful search callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    find: function(searchParameters, extraParameters, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            this._find(searchParameters, extraParameters, transaction, successCallback, errorCallback);
        }).bind(this));
    },

    /** @protected */
    _createCountStatement: function() {
        return new Database.CountStatement(this.tableModel);
    },

    /** @protected */
    _createInsertStatement: function() {
        return new Database.InsertStatement(this.tableModel);
    },

    /** @protected */
    _createUpdateStatement: function() {
        return new Database.UpdateStatement(this.tableModel);
    },

    /** @protected */
    _createDeleteStatement: function() {
        return new Database.DeleteStatement(this.tableModel);
    },

    /** @protected */
    _createSelectStatement: function() {
        return new Database.SelectStatement(this.tableModel);
    },

    /** @protected */
    _createTransaction: function() {
        return new Database.Transaction(this.db);
    },

    /** @protected */
    _update: function(model, transaction, successCallback, errorCallback) {
        var updateContext = this._createUpdateStatement().toUpdateSql(model);
        transaction.executeSql(updateContext.sql, updateContext.params, (function(transaction, resultSet) {
            successCallback(resultSet);
        }).bind(this), errorCallback);
    },

    /** @protected */
    _findById: function(id, transaction, successCallback, errorCallback) {
        this._find({id: id}, {}, transaction, function(models) {
            if (models.length > 0) {
                successCallback(models[0]);
            } else {
                successCallback(null);
            }
        }, errorCallback);
    },

    /** @protected */
    _find: function(searchParameters, extraParameters, transaction, successCallback, errorCallback) {
        var selectContext = this._createSelectStatement().toSelectSql(searchParameters, extraParameters);
        Mojo.Log.info("[_find] - sql: %s", selectContext.sql);
        transaction.executeSql(selectContext.sql, selectContext.params,
                this._mapSqlResultSet.bind(this, successCallback, errorCallback), errorCallback);
    },

    /** @private */
    _mapSqlResultSet: function(clientSuccessCallback, clientErrorCallback, transaction, sqlResultSet) {
        this.resultSetMapper.map(sqlResultSet, clientSuccessCallback, clientErrorCallback);
    }
});