Models.GenericManagerTest = Class.create({
    before: function() {
        this._db = new MockDatabase();
        this._mapper = new MockGenericMapper();
        this._genericManager = new Models.GenericManager(this._db, this._mapper);

        return Mojo.Test.beforeFinished;
    },

    after: function(completionCallback) {
        completionCallback();
    },

    test_count_should_use_generic_mapper_to_generate_query: function() {
        this._genericManager.count(Prototype.emptyFunction, Prototype.emptyFunction);
        this._db.callback(new MockTransaction());

        Mojo.require(this._mapper.countCalled);

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

        Mojo.require(this._mapper.toDeleteSqlCalled);

        return Mojo.Test.passed;
    },

    test_find_should_use_generic_mapper_to_generate_query: function() {
        this._genericManager.find({}, {}, Prototype.emptyFunction, Prototype.emptyFunction);
        this._db.callback(new MockTransaction());

        Mojo.require(this._mapper.toSelectSqlCalled);

        return Mojo.Test.passed;
    },

    test_find_should_use_generic_mapper_to_convert_sql_result_set: function() {
        this._genericManager.find({}, {}, Prototype.emptyFunction, Prototype.emptyFunction);

        var transaction = new MockTransaction();
        this._db.callback(transaction);
        transaction.successHandler(transaction, {});

        Mojo.require(this._mapper.toModelResultSetCalled);

        return Mojo.Test.passed;
    }
});