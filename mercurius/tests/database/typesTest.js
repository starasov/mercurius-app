Database.TypesTest = Class.create({
    test_boolean_to_sql_type_should_return_zero_when_false_passed: function() {
        var booleanType = new Database.Types.Boolean();
        Mojo.requireEqual(0, booleanType.toSqlType(false));
        return Mojo.Test.passed;
    },

    test_boolean_to_sql_type_should_return_one_when_true_passed: function() {
        var booleanType = new Database.Types.Boolean();
        Mojo.requireEqual(1, booleanType.toSqlType(true));
        return Mojo.Test.passed;
    },

    test_boolean_to_sql_type_should_return_null_when_null_passed_and_type_nullable: function() {
        var booleanType = new Database.Types.Boolean(Database.Types.Nullable);
        Mojo.requireEqual(null, booleanType.toSqlType(null));
        return Mojo.Test.passed;
    },

    test_boolean_to_sql_type_should_return_zero_when_null_passed_and_type_non_nullable: function() {
        var booleanType = new Database.Types.Boolean();
        Mojo.requireEqual(0, booleanType.toSqlType(null));
        return Mojo.Test.passed;
    },

    test_boolean_from_sql_type_should_return_null_when_null_passed_and_type_nullable: function() {
        var booleanType = new Database.Types.Boolean(Database.Types.Nullable);
        Mojo.requireEqual(null, booleanType.fromSqlType(null));
        return Mojo.Test.passed;
    },

    test_boolean_from_sql_type_should_return_false_when_null_passed_and_type_non_nullable: function() {
        var booleanType = new Database.Types.Boolean();
        Mojo.requireEqual(false, booleanType.fromSqlType(null));
        return Mojo.Test.passed;
    }
});