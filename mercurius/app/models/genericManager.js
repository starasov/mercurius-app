Models.GenericManager = Class.create({
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
    initialize: function(db, resultSetMapper, helper) {
        Mojo.require(db, "Database should be defined and can't be null.");
        Mojo.require(resultSetMapper, "Result Set Mapper should be defined and can't be null.");
        Mojo.require(helper, "Helper should be defined and can't be null.");

        this._db = db;
        this._resultSetMapper = resultSetMapper;
        this._helper = helper;
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
    count: function(successCallback, errorCallback) {
        this._db.transaction((function(transaction) {
            var countContext = this._helper.toCountSql();
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
    save: function(entity, successCallback, errorCallback) {
        this._db.transaction((function(transaction) {
            var insertContext = this._helper.toInsertSql(entity);
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
    update: function(entity, successCallback, errorCallback) {
        this._db.transaction((function(transaction) {
            var updateContext = this._helper.toUpdateSql(entity);
            transaction.executeSql(updateContext.sql, updateContext.params, function(tr, resultSet) {
                successCallback(resultSet)
            }, errorCallback);
        }).bind(this));
    },

    saveOrUpdate: function(entity, successCallback, errorCallback) {
        if (entity.id) {
            this.update(entity, successCallback, errorCallback);
        } else {
            this.save(entity, successCallback, errorCallback);
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

        this._db.transaction((function(transaction) {
            var deleteContext = this._helper.toDeleteSql(id);
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
        this.find({'id': id}, {}, function(resultSet) {
            if (resultSet.length != 0) {
                successCallback(resultSet[0]);
            } else {
                successCallback(null);
            }
        }, errorCallback)
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
        this._db.transaction((function(transaction) {
            var selectContext = this._helper.toSelectSql(searchParameters, extraParameters);
            transaction.executeSql(selectContext.sql, selectContext.params,
                    this._successCallback.bind(this, successCallback, errorCallback), errorCallback);
        }).bind(this));
    },

    _successCallback: function(innerSuccessCallback, innerErrorCallback, transaction, sqlResultSet) {
        this._resultSetMapper.map(sqlResultSet, innerSuccessCallback, innerErrorCallback);
    }
});