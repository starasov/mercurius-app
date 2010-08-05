Models.GenericManagerTest = Class.create({
    before: function() {
        this.db = new MockDatabase();
        this.resultSetMapper = new MockResultSetMapper();
        this.genericManager = new Models.GenericManager(this.db, {}, this.resultSetMapper);

        return Mojo.Test.beforeFinished;
    },

    test_delete_should_fail_when_non_numeric_id_passed: function() {
        Test.requireException((function() {
            this.genericManager.deleteById("1", Prototype.emptyFunction, Prototype.emptyFunction);
        }).bind(this));

        return Mojo.Test.passed;
    },

    test_find_should_use_generic_mapper_to_convert_sql_result_set: function() {
        this.genericManager.find({}, {}, Prototype.emptyFunction, Prototype.emptyFunction);

        var transaction = new MockTransaction();
        this.db.callback(transaction);
        transaction.successHandler(transaction, {});

        Mojo.require(this.resultSetMapper.mapCalled);

        return Mojo.Test.passed;
    }
});