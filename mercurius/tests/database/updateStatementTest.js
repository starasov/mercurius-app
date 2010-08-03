Database.UpdateStatementTest = Class.create(Database.BaseStatementTest, {
    before: function($super) {
        $super();
        this.statement = new Database.UpdateStatement(this.tableModel);

        return Mojo.Test.beforeFinished;
    },

    test_to_update_sql_should_require_entity: function() {
        Test.requireException((function() {
            this.statement.toUpdateSql(undefined);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_id_field_in_entity: function() {
        Test.requireException((function() {
            this.statement.toUpdateSql({name: '1'});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_when_all_field_available: function() {
        var updateContext = this.statement.toUpdateSql({id: 1, name: "name", some_flag: true});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual(["name", 1, 1], updateContext.params);

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_with_nulls_when_missing_fields_found: function() {
        var updateContext = this.statement.toUpdateSql({id: 1, some_flag: null});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual([null, null, 1], updateContext.params);

        return Mojo.Test.passed;
    }
});