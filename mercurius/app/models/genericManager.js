Models.GenericManager = Class.create({
    /**
     * @param db - {Database} an initialized database instance.
     * @param tableModel - {map} a table model to be managed.
     * @param mapper - {Database.Mapper} a database mapper for particular model.
     *
     * ToDO: move all other methods like count and delete into mapper.
     */
    initialize: function(db, tableModel, mapper) {
        Mojo.require(db);
        Mojo.require(tableModel);

        this._db = db;
        this._tableModel = tableModel;
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
            transaction.executeSql(this._mapper.toCountSql(), [],
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
     * @param successCallback - {callback} (transaction, resultSet)
     * @param errorCallback - {callback} (transaction, error)
     */
    deleteById: function(id, successCallback, errorCallback) {
        Mojo.requireNumber(id);

        this._db.transaction((function(transaction) {
            var sql = "DELETE FROM " + this._tableModel.Name + " WHERE id=?";
            transaction.executeSql(sql, [id], successCallback, errorCallback);
        }).bind(this));
    },

    findById: function(id, successCallback, errorCallback) {
    },

    find: function(searchParameters, successCallback, errorCallback) {
    }
});