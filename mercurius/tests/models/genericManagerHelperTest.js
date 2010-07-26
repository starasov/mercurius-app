Models.GenericManagerHelperTest = Class.create({
    before: function() {
        this._tableModel = {
            Name: "name_and_flag",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                some_flag: new Database.Types.Boolean(Database.Types.Nullable)
            }
        };

        this._resultSetMapper = new Models.GenericManagerHelper(this._tableModel);
        
        return Mojo.Test.beforeFinished;
    },

    test_to_count_should_return_expected_query_when_no_search_parameters_specified: function() {
        var countContext = this._resultSetMapper.toCountSql();
        Mojo.requireEqual("SELECT COUNT(*) as count FROM name_and_flag;", countContext.sql);
        return Mojo.Test.passed;
    },

    test_to_count_should_return_expected_query_when_search_parameters_specified: function() {
        var countContext = this._resultSetMapper.toCountSql({some_flag: true});
        Mojo.requireEqual("SELECT COUNT(*) as count FROM name_and_flag WHERE some_flag=?;", countContext.sql);
        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_fail_when_entity_not_passed: function() {
        Test.requireException((function() {
            this._resultSetMapper.toInsertSql(undefined);
        }).bind(this));
        
        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_valid_sql_when_all_data_available: function() {
        var insertContext = this._resultSetMapper.toInsertSql({name: "name", some_flag: true});

        Mojo.requireEqual("INSERT INTO name_and_flag (name, some_flag) VALUES(?, ?);", insertContext.sql);
        Test.requireArraysEqual(["name", 1], insertContext.params);

        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_sql_with_nulls_when_data_partially_available: function() {
        var insertContext = this._resultSetMapper.toInsertSql({some_flag: null});

        Mojo.requireEqual("INSERT INTO name_and_flag (name, some_flag) VALUES(?, ?);", insertContext.sql);
        Test.requireArraysEqual([null, null], insertContext.params);

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_entity: function() {
        Test.requireException((function() {
            this._resultSetMapper.toUpdateSql(undefined);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_id_field_in_entity: function() {
        Test.requireException((function() {
            this._resultSetMapper.toUpdateSql({name: '1'});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_when_all_field_available: function() {
        var updateContext = this._resultSetMapper.toUpdateSql({id: 1, name: "name", some_flag: true});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual(["name", 1, 1], updateContext.params);

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_with_nulls_when_missing_fields_found: function() {
        var updateContext = this._resultSetMapper.toUpdateSql({id: 1, some_flag: null});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual([null, null, 1], updateContext.params);

        return Mojo.Test.passed;
    },

    test_to_delete_sql_should_fail_when_non_numeric_id_passed: function() {
        Test.requireException((function() {
            this._resultSetMapper.toDeleteSql("1");
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_delete_sql_should_return_valid_delete_statement: function() {
        var deleteContext = this._resultSetMapper.toDeleteSql(1);

        Mojo.requireEqual("DELETE FROM name_and_flag WHERE id=?;", deleteContext.sql);
        Test.requireArraysEqual([1], deleteContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_omit_where_clause_when_no_params_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql();

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag;", selectContext.sql);
        Test.requireArraysEqual([], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_existing_column_name_passed: function() {
        Test.requireException((function() {
            this._resultSetMapper.toSelectSql({non_exists: 1});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_where_clause_when_parameters_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql({id: 1});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=?;", selectContext.sql);
        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_order_by_when_valid_column_name_specified: function() {
        var selectContext = this._resultSetMapper.toSelectSql({id: 1}, {order: "name"});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=? ORDER BY name;", selectContext.sql);
        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_exiting_column_passed_with_order: function() {
        Test.requireException((function() {
            this._resultSetMapper.toSelectSql({id: 1}, {order: "gender"});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_limit_when_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql({id: 1}, {limit: 10});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=? LIMIT ?;", selectContext.sql);
        Test.requireArraysEqual([1, 10], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_not_include_offset_when_no_limit_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql({id: 1}, {offset: 10});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=?;", selectContext.sql);
        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_offset_when_limit_and_offset_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql({id: 1}, {limit: 1, offset: 0});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=? LIMIT ? OFFSET ?;", selectContext.sql);
        Test.requireArraysEqual([1, 1, 0], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_order_limit_and_offset_when_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql({id: 1}, {order: "id", limit: 10, offset: 20});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=? ORDER BY id LIMIT ? OFFSET ?;", selectContext.sql);
        Test.requireArraysEqual([1, 10, 20], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_group_clause_when_passed: function() {
        var selectContext = this._resultSetMapper.toSelectSql({}, {group: "some_flag"});
        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag GROUP BY some_flag;", selectContext.sql);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_exiting_column_passed_with_group: function() {
        Test.requireException((function() {
            this._resultSetMapper.toSelectSql({}, {group: "gender"});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_group_multiple_search_parameters_with_AND_operator: function() {
        var selectContext = this._resultSetMapper.toSelectSql({name: "Named", some_flag: true}, {});
        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE name=? AND some_flag=?;", selectContext.sql);
        return Mojo.Test.passed;
    }
});