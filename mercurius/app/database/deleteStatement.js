Database.DeleteStatement = Class.create(Database.BaseLookupStatement, {
    toDeleteSql: function(id) {
        Mojo.requireNumber(id, "Passed 'id' should be defined and can't be null.");

        var deleteContext = {};

        deleteContext.sql =  "DELETE FROM " + this.tableModel.Name + " WHERE id=?;";
        deleteContext.params = [id];

        return deleteContext;
    }
});