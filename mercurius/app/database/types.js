if (!Database.Types) Database.Types = {};


Database.Types.Null = "NULL";
Database.Types.NotNull = "NOT NULL";


Database.Types.BaseType = Class.create({
    /**
     * Base SQL type.
     *
     * @param nullable - {Database.Types.Null} or {Database.Types.NotNull} identifies
     *                   whether nulls are acceptable values for particular database column.
     */
    initialize: function(nullable) {
        this.nullable = nullable;
    },

    fromSqlType: function(value) {
        return value;
    },

    toSqlType: function(value) {
        return value;
    }
});


/**
 * Primary Key type. 
 */
Database.Types.PrimaryKey = Class.create(Database.Types.BaseType, {
    SqlType: "INTEGER PRIMARY KEY",

    initialize: function($super) {
        $super(Database.Types.NotNull);
    }
});


/**
 * Integer type.
 */
Database.Types.Integer = Class.create(Database.Types.BaseType, {
    SqlType: "INTEGER",

    initialize: function($super, nullable) {
        $super(nullable);
    }
});


/**
 * String type.
 */
Database.Types.String = Class.create(Database.Types.BaseType, {
    SqlType: "TEXT",

    initialize: function($super, nullable) {
        $super(nullable);
    }
});


/**
 * Boolean type.
 */
Database.Types.Boolean = Class.create(Database.Types.BaseType, {
    SqlType: "INTEGER",

    initialize: function($super, nullable) {
        $super(nullable);
    },

    fromSqlType: function(value) {
        return new Boolean(value);

    },

    toSqlType: function(value) {
        if (value == null && this.nullable == Database.Types.Null) {
            return null;
        }

        return (value ? 1 : 0);
    }
});


/**
 * Real type.
 */
Database.Types.String = Class.create(Database.Types.BaseType, {
    SqlType: "REAL",

    initialize: function($super, nullable) {
        $super(nullable);
    }
});


// ToDO: remove it as far as generic mapper become ready
Database.Types.String.SPECIAL_CHARACTERS = ["'", ";", "(", ")", "\\"];

// ToDO: remove it as far as generic mapper become ready
Database.Types.String.toSql = function(value) {
    Mojo.requireString(value);

    var escapedValue = "";
    for (var i = 0; i < value.length; i++) {
        var c = value[i];

        if (Database.Types.String.SPECIAL_CHARACTERS.indexOf(c) != -1) {
            escapedValue += "\\";
        }

        escapedValue += c;
    }

    return "'" + escapedValue + "'";
};