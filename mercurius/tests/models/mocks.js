var MockGenericMapper = Class.create({
    toCountSql: function(id) {
        this.countCalled = true;
        return {};
    },

    toDeleteSql: function(id) {
        this.toDeleteSqlCalled = true;
        return {};
    }
});