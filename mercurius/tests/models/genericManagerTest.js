Models.GenericManagerTest = Class.create({
    before: function() {
        this._db = new MockDatabase();
        this._helper = new MockGenericHelper();
        this._resultSetMapper = new MockResultSetMapper();
        this._genericManager = new Models.GenericManager(this._db, this._resultSetMapper, this._helper);

        return Mojo.Test.beforeFinished;
    },

    after: function(completionCallback) {
        completionCallback();
    },

    test_count_should_use_generic_mapper_to_generate_query: function() {
        this._genericManager.count({}, Prototype.emptyFunction, Prototype.emptyFunction);
        this._db.callback(new MockTransaction());

        Mojo.require(this._helper.countCalled);

        return Mojo.Test.passed;
    },

    test_save_should_execute_valid_sql_query_when_called: function() {
        this._helper.toInsertSqlResult = {sql: "insert_sql", params: "insert_params"};
        this._genericManager.save({}, Prototype.emptyFunction, Prototype.emptyFunction);

        var transaction = new MockTransaction();
        this._db.callback(transaction);

        Mojo.requireEqual("insert_sql", transaction.sql);
        Mojo.requireEqual("insert_params", transaction.parameters);

        return Mojo.Test.passed;
    },

    test_update_should_execute_valid_sql_query_when_called: function() {
        this._helper.toUpdateSqlResult = {sql: "update_sql", params: "update_params"};
        this._genericManager.update({}, Prototype.emptyFunction, Prototype.emptyFunction);

        var transaction = new MockTransaction();
        this._db.callback(transaction);

        Mojo.requireEqual("update_sql", transaction.sql);
        Mojo.requireEqual("update_params", transaction.parameters);

        return Mojo.Test.passed;
    },

    test_delete_should_fail_when_non_numeric_id_passed: function() {
        Test.requireException((function() {
            this._genericManager.deleteById("1", Prototype.emptyFunction, Prototype.emptyFunction);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_delete_should_use_generic_mapper_to_generate_query: function() {
        this._genericManager.deleteById(1, Prototype.emptyFunction, Prototype.emptyFunction);
        this._db.callback(new MockTransaction());

        Mojo.require(this._helper.toDeleteSqlCalled);

        return Mojo.Test.passed;
    },

    test_find_should_use_generic_mapper_to_generate_query: function() {
        this._genericManager.find({}, {}, Prototype.emptyFunction, Prototype.emptyFunction);
        this._db.callback(new MockTransaction());

        Mojo.require(this._helper.toSelectSqlCalled);

        return Mojo.Test.passed;
    },

    test_find_should_use_generic_mapper_to_convert_sql_result_set: function() {
        this._genericManager.find({}, {}, Prototype.emptyFunction, Prototype.emptyFunction);

        var transaction = new MockTransaction();
        this._db.callback(transaction);
        transaction.successHandler(transaction, {});

        Mojo.require(this._resultSetMapper.mapCalled);

        return Mojo.Test.passed;
    }
});