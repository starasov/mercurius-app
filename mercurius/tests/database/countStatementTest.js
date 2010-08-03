Database.CountStatementTest = Class.create(Database.BaseStatementTest, {
    before: function($super) {
        $super();
        this.statement = new Database.CountStatement(this.tableModel);

        return Mojo.Test.beforeFinished;
    },

    test_to_count_should_return_expected_query_when_no_search_parameters_specified: function() {
        var countContext = this.statement.toCountSql();
        Mojo.requireEqual("SELECT COUNT(*) as count FROM name_and_flag;", countContext.sql);
        return Mojo.Test.passed;
    },

    test_to_count_should_return_expected_query_when_search_parameters_specified: function() {
        var countContext = this.statement.toCountSql({some_flag: true});
        Mojo.requireEqual("SELECT COUNT(*) as count FROM name_and_flag WHERE some_flag=?;", countContext.sql);
        return Mojo.Test.passed;
    }
});