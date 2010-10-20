Categories.Mapper = Class.create(Database.BaseMapper, {
    findByNameAndParent: function(name, parentId, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(Categories.Mapper._findByNameAndParentSql, [name, parentId],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    findTopCategoriesByType: function(type, limit, offset, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(Categories.Mapper._findTopCategoriesByTypeSql, [type, limit, offset],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    findChildCategories: function(parentId, limit, offset, successCallback, errorCallback) {
        this.db.transaction((function(transaction) {
            transaction.executeSql(Categories.Mapper._findChildCategoriesSql, [parentId, limit, offset],
                this._handleMultipleResults.bind(this, successCallback), errorCallback);
        }).bind(this));
    },

    getCountSql: function() {
        return Categories.Mapper._countSql;
    },

    getSaveSql: function() {
        return Categories.Mapper._saveSql;
    },

    getUpdateSql: function() {
        return Categories.Mapper._updateSql;
    },

    getDeleteSql: function() {
        return Categories.Mapper._deleteSql;
    },

    getFindByIdSql: function() {
        return Categories.Mapper._findByIdSql;
    },

    getFindAllSql: function() {
        return Categories.Mapper._findAllSql;
    },

    getBaseColumns: function() {
        return Categories.Mapper._baseColumns;
    }
});

Categories.Mapper._baseColumns = ["name", "type", "parent_id"];

Categories.Mapper._countSql =
        "SELECT COUNT(*) as count FROM categories;";

Categories.Mapper._saveSql =
        "INSERT INTO categories(name, type, parent_id) VALUES(?, ?, ?);";

Categories.Mapper._updateSql =
        "UPDATE categories SET name=?, type=?, parent_id=? WHERE id=?;";

Categories.Mapper._deleteSql =
        "DELETE FROM categories WHERE id=?;";

Categories.Mapper._findByIdSql =
        "SELECT id, name, type, parent_id FROM categories WHERE id=?;";

Categories.Mapper._findAllSql =
        "SELECT id, name, type, parent_id FROM categories ORDER BY type, name LIMIT ? OFFSET ?;";

Categories.Mapper._findChildCategoriesSql =
        "SELECT id, name, type, parent_id FROM categories WHERE parent_id=? ORDER BY type, name LIMIT ? OFFSET ?;";

Categories.Mapper._findTopCategoriesByTypeSql =
        "SELECT id, name, type, parent_id FROM categories WHERE parent_id=0 AND type=? ORDER BY type, name LIMIT ? OFFSET ?;";

Categories.Mapper._findByNameAndParentSql =
        "SELECT id, name, type, parent_id FROM categories WHERE name=? AND parent_id=?;";

