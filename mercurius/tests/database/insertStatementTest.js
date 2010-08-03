Database.InsertStatementTest = Class.create(Database.BaseStatementTest, {
    before: function($super) {
        $super();
        this.statement = new Database.InsertStatement(this.tableModel);

        return Mojo.Test.beforeFinished;
    },

    test_to_insert_sql_should_fail_when_entity_not_passed: function() {
        Test.requireException((function() {
            this.statement.toInsertSql(undefined);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_valid_sql_when_all_data_available: function() {
        var insertContext = this.statement.toInsertSql({name: "name", some_flag: true});

        Mojo.requireEqual("INSERT INTO name_and_flag (name, some_flag) VALUES(?, ?);", insertContext.sql);
        Test.requireArraysEqual(["name", 1], insertContext.params);

        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_sql_with_nulls_when_data_partially_available: function() {
        var insertContext = this.statement.toInsertSql({some_flag: null});

        Mojo.requireEqual("INSERT INTO name_and_flag (name, some_flag) VALUES(?, ?);", insertContext.sql);
        Test.requireArraysEqual([null, null], insertContext.params);

        return Mojo.Test.passed;
    }
});
