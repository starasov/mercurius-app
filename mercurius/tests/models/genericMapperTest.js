Models.GenericMapperTest = Class.create({
    name: "Models.GenericMapperTest",
    
    before: function() {
        this._tableModel = {
            Name: "name_and_flag",
            Columns: {
                id: new Database.Types.PrimaryKey(),
                name: new Database.Types.String(),
                some_flag: new Database.Types.Boolean()
            }
        };

        this._mapper = new Models.Mapper(this._tableModel);
        
        return Mojo.Test.beforeFinished;
    },

    test_to_count_should_return_expected_query: function() {
        var sql = this._mapper.toCountSql();
        Mojo.requireEqual("SELECT COUNT(*) as count FROM name_and_flag;", sql);
        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_fail_when_entity_not_passed: function() {
        try {
            this._mapper.toInsertSql(undefined);
            Mojo.require(false);
        } catch (e) {
            // Expected behavior.
        }

        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_valid_sql_when_all_data_available: function() {
        var sql = this._mapper.toInsertSql({id: 1, name: "name", some_flag: true});
        Mojo.requireEqual("INSERT INTO name_and_flag (id,name,some_flag) VALUES(1,'name',1);", sql);
        return Mojo.Test.passed;
    },

    test_to_insert_sql_should_generate_sql_with_nulls_when_data_partially_available: function() {
        var sql = this._mapper.toInsertSql({id: 1, some_flag: null});
        Mojo.requireEqual("INSERT INTO name_and_flag (id,name,some_flag) VALUES(1,NULL,NULL);", sql);
        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_entity: function() {
        try {
            this._mapper.toUpdateSql(undefined);
            Mojo.require(false);
        } catch (e) {
            // Expected behavior.
        }

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_require_id_field_in_entity: function() {
        try {
            this._mapper.toUpdateSql({name: '1'});
            Mojo.require(false);
        } catch (e) {
            // Expected behavior.
        }

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_when_all_field_available: function() {
        var updateContext = this._mapper.toUpdateSql({id: 1, name: "name", some_flag: true});

        Mojo.requireEqual("UPDATE name_and_flag SET name=?, some_flag=? WHERE id=?;", updateContext.sql);
        Test.requireArraysEqual(["name", 1, 1], updateContext.params);

        return Mojo.Test.passed;
    },

    test_to_update_sql_should_generate_valid_sql_with_nulls_when_missing_fields_found: function() {
        var sql = this._mapper.toUpdateSql({id: 1, some_flag: null});
        Mojo.requireEqual("UPDATE name_and_flag SET name=NULL,some_flag=NULL WHERE id=1;", sql);
        return Mojo.Test.passed;
    }
});