Models.GenericManagerTest = Class.create({
    before: function() {
        this._db = new MockDatabase();
        this._testTableModel = {
            Name: "test_table_1",
            Columns: {
                id: new Database.Types.PrimaryKey()
            }
        };

        return Mojo.Test.beforeFinished;
    },

    after: function(completionCallback) {
        completionCallback();
    },

    test_delete_should_fail_if_no_id_specified: function() {
        var genericManager = new Models.GenericManager(this._db, this._testTableModel);

        try {
            genericManager.deleteById("not a number", Prototype.emptyFunction, Prototype.emptyFunction);
            Mojo.requre(false, "Shouldn't reach here - manager should raise an exception in case when passed id not a number.")            
        } catch(e) {
            // Generic manager should raise an exception here.
        }

        return Mojo.Test.passed;
    }

});