Models.GenericMapperTest = Class.create({
    name: "Models.GenericMapperTest",
    
    before: function() {
        this._tableModel = {
            Name: "name_and_flag",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                some_flag: new Database.Types.Boolean(Database.Types.Nullable)
            }
        };

        this._mapper = new Models.GenericMapper(this._tableModel);
        
        return Mojo.Test.beforeFinished;
    },

    test_to_count_should_return_expected_query: function() {
        var countContext = this._mapper.toCountSql();
        Mojo.requireEqual("SELECT COUNT(*) as count FROM name_and_flag;", countContext.sql);
        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_fail_when_entity_not_passed: function() {
        Test.requireException((function() {
            this._mapper.toInsertSql(undefined);
        }).bind(this));
        
        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_valid_sql_when_all_data_available: function() {
        var insertContext = this._mapper.toInsertSql({name: "name", some_flag: true});

        Mojo.requireEqual("INSERT INTO name_and_flag (name, some_flag) VALUES(?, ?);", insertContext.sql);
        Test.requireArraysEqual(["name", 1], insertContext.params);

        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_sql_with_nulls_when_data_partially_available: function() {
        var insertContext = this._mapper.toInsertSql({some_flag: null});

        Mojo.requireEqual("INSERT INTO name_and_flag (name, some_flag) VALUES(?, ?);", insertContext.sql);
        Test.requireArraysEqual([null, null], insertContext.params);

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_entity: function() {
        Test.requireException((function() {
            this._mapper.toUpdateSql(undefined);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_id_field_in_entity: function() {
        Test.requireException((function() {
            this._mapper.toUpdateSql({name: '1'});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_when_all_field_available: function() {
        var updateContext = this._mapper.toUpdateSql({id: 1, name: "name", some_flag: true});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual(["name", 1, 1], updateContext.params);

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_with_nulls_when_missing_fields_found: function() {
        var updateContext = this._mapper.toUpdateSql({id: 1, some_flag: null});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual([null, null, 1], updateContext.params);

        return Mojo.Test.passed;
    },

    test_to_delete_sql_should_fail_when_non_numeric_id_passed: function() {
        Test.requireException((function() {
            this._mapper.toDeleteSql("1");
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_delete_sql_should_return_valid_delete_statement: function() {
        var deleteContext = this._mapper.toDeleteSql(1);

        Mojo.requireEqual("DELETE FROM name_and_flag WHERE id=?;", deleteContext.sql);
        Test.requireArraysEqual([1], deleteContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_omit_where_clause_when_no_params_passed: function() {
        var selectContext = this._mapper.toSelectSql();

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag;", selectContext.sql);
        Test.requireArraysEqual([], selectContext.params);

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_raise_exception_when_non_existing_column_name_passed: function() {
        Test.requireException((function() {
            this._mapper.toSelectSql({non_exists: 1});
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_to_select_sql_should_include_where_clause_when_parameters_passed: function() {
        var selectContext = this._mapper.toSelectSql({id: 1});

        Mojo.requireEqual("SELECT id, name, some_flag FROM name_and_flag WHERE id=?;", selectContext.sql);
        Test.requireArraysEqual([1], selectContext.params);

        return Mojo.Test.passed;
    }
});