Database.DeleteStatementTest = Class.create(Database.BaseStatementTest, {
    before: function($super) {
        $super();
        this.statement = new Database.DeleteStatement(this.tableModel);

        return Mojo.Test.beforeFinished;
    },

    test_to_delete_sql_should_fail_when_non_numeric_id_passed: function() {
        Test.requireException((function() {
            this.statement.toDeleteSql("1");
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_delete_sql_should_return_valid_delete_statement: function() {
        var deleteContext = this.statement.toDeleteSql(1);

        Mojo.requireEqual("DELETE FROM name_and_flag WHERE id=?;", deleteContext.sql);
        Test.requireArraysEqual([1], deleteContext.params);

        return Mojo.Test.passed;
    }
});