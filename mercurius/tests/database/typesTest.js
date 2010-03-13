Database.TypesTest = Class.create({
    test_boolean_to_sql_should_return_zero_when_false_passed: function() {
        var primaryKey = new Database.Types.Boolean();
        Mojo.requireEqual('0', primaryKey.toSql(false));
        return Mojo.Test.passed;
    },

    test_boolean_to_sql_should_return_one_when_true_passed: function() {
        var primaryKey = new Database.Types.Boolean();
        Mojo.requireEqual('1', primaryKey.toSql(true));
        return Mojo.Test.passed;
    }
});