var MockGenericMapper = Class.create({
    toModelResultSet: function(sqlResultSet) {
        this.toModelResultSetCalled = true;
        return {};
    },

    toCountSql: function(id) {
        this.countCalled = true;
        return {};
    },

    toDeleteSql: function(id) {
        this.toDeleteSqlCalled = true;
        return {};
    },

    toSelectSql: function(searchParams) {
        this.toSelectSqlCalled = true;
        return {};
    }
});