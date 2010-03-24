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
     * @param mapper - {Database.Mapper} a database mapper for particular model.
     */
    initialize: function(db, mapper) {
        Mojo.require(db, "Database should be defined and can't be null.");
        Mojo.require(mapper, "Mapper should be defined and can't be null.");

        this._db = db;
        this._mapper = mapper;
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
            var countContext = this._mapper.toCountSql();

            transaction.executeSql(countContext.sql, countContext.params,
                    function(tr, resultSet) {
                        successCallback(tr, resultSet.rows.item(0).count)
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
            var sql = this._mapper.toInsertSql(entity);
            transaction.executeSql(sql, [],
                    function(tr, resultSet) {
                        successCallback(tr, resultSet)
                    }, errorCallback);
        }).bind(this));
    },


    /**
     * Updates existing record in the table with new data.
     *
     * @param successCallback - {callback} (transaction, count) a callback receives
     * actual transaction and updates items count.
     *
     * @param errorCallback - {callback} (transaction, error) a callback receives error
     * notification in case if something went wrong with insert.
     */
    update: function(entity, successCallback, errorCallback) {
        this._db.transaction((function(transaction) {
            var sql = this._mapper.toUpdateSql(entity);
            transaction.executeSql(sql, [],
                    function(tr, resultSet) {
                        successCallback(tr, resultSet)
                    }, errorCallback);
        }).bind(this));
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
            var deleteContext = this._mapper.toDeleteSql(id);
            transaction.executeSql(deleteContext.sql, deleteContext.params, successCallback, errorCallback);
        }).bind(this));
    },

    /**
     * Searches for particular record by specified id.
     *
     * @param id - {number} an entity id to be searched for.
     * @param successCallback - {callback} (transaction, resultSet) a successful search callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    findById: function(id, successCallback, errorCallback) {
        this.find({'id': id}, successCallback, errorCallback)
    },

    /**
     * Searches for all available records in the table.
     *
     * @param successCallback - {callback} (transaction, resultSet) a successful search callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    all: function(successCallback, errorCallback) {
        this.find(null, successCallback, errorCallback);
    },

    /**
     * Searches for records that match passed search parameters.
     *
     * @param searchParameters - {hash} a hash with select parameters. If 'undefined'
     *                           or 'null' is passed then no where part is generated
     *                           and all records in the table will be returned.

     * @param successCallback - {callback} (transaction, resultSet) a successful search callback.
     * @param errorCallback - {callback} (transaction, error) an error callback.
     */
    find: function(searchParameters, successCallback, errorCallback) {
        this._db.transaction((function(transaction) {
            var selectContext = this._mapper.toSelectSql(searchParameters);
            transaction.executeSql(selectContext.sql, selectContext.params, this._successCallback.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    _successCallback: function(clientSuccessCallback, transaction, sqlResultSet) {
        var resultSet = this._mapper.toModelResultSet(sqlResultSet);
        clientSuccessCallback(transaction, resultSet);
    }
});