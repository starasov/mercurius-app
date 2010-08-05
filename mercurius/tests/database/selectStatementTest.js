Database.SelectStatementTest = Class.create(Database.BaseStatementTest, {
    before: function($super) {
        $super();
        this.statement = new Database.SelectStatement(this.tableModel);
        return Mojo.Test.beforeFinished;
    },

    test_to_select_sql_should_omit_where_clause_when_no_params_passed: function() {
        var selectContext = this.statement.toSelectSql();

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag;", selectContext.sql);
        
        Test.requireArraysEqual([], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_existing_column_name_passed: function() {
        Test.requireException((function() {
            this.statement.toSelectSql({non_exists: 1});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_where_clause_when_parameters_passed: function() {
        var selectContext = this.statement.toSelectSql({id: 1});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.id=?;", selectContext.sql);

        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_order_by_when_valid_column_name_specified: function() {
        var selectContext = this.statement.toSelectSql({id: 1}, {order: "name"});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.id=? ORDER BY name_and_flag.name;", selectContext.sql);
        
        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_exiting_column_passed_with_order: function() {
        Test.requireException((function() {
            this.statement.toSelectSql({id: 1}, {order: "gender"});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_limit_when_passed: function() {
        var selectContext = this.statement.toSelectSql({id: 1}, {limit: 10});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.id=? LIMIT ?;", selectContext.sql);

        Test.requireArraysEqual([1, 10], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_not_include_offset_when_no_limit_passed: function() {
        var selectContext = this.statement.toSelectSql({id: 1}, {offset: 10});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.id=?;", selectContext.sql);
        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_offset_when_limit_and_offset_passed: function() {
        var selectContext = this.statement.toSelectSql({id: 1}, {limit: 1, offset: 0});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.id=? LIMIT ? OFFSET ?;", selectContext.sql);
        
        Test.requireArraysEqual([1, 1, 0], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_order_limit_and_offset_when_passed: function() {
        var selectContext = this.statement.toSelectSql({id: 1}, {order: "id", limit: 10, offset: 20});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.id=? ORDER BY name_and_flag.id LIMIT ? OFFSET ?;", selectContext.sql);
        Test.requireArraysEqual([1, 10, 20], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_group_clause_when_passed: function() {
        var selectContext = this.statement.toSelectSql({}, {group: "some_flag"});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag GROUP BY name_and_flag.some_flag;", selectContext.sql);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_exiting_column_passed_with_group: function() {
        Test.requireException((function() {
            this.statement.toSelectSql({}, {group: "gender"});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_group_multiple_search_parameters_with_AND_operator: function() {
        var selectContext = this.statement.toSelectSql({name: "Named", some_flag: true}, {});

        Mojo.requireEqual("SELECT name_and_flag.id AS id, name_and_flag.name AS name, name_and_flag.some_flag AS some_flag " +
                          "FROM name_and_flag WHERE name_and_flag.name=? AND name_and_flag.some_flag=?;", selectContext.sql);

        return Mojo.Test.passed;
    }
});