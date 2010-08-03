if (!Database.Types) Database.Types = {};

Database.Types.Nullable = "NULLABLE";
Database.Types.NonNullable = "NON_NULLABLE";


Database.Types.BaseType = Class.create({
    /**
     * Base SQL type.
     *
     * @param nullable - {Database.Types.Null} or {Database.Types.NotNull} identifies
     *                   whether nulls are acceptable values for particular database
     *                   column.
     */
    initialize: function(nullable) {
        this._nullable = nullable ? nullable : Database.Types.Nullable;
    },

    isNullable: function() {
        return this._nullable == Database.Types.Nullable;
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
        $super(Database.Types.NonNullable);
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
        if (value == null && this.isNullable()) {
            return null;
        }
        
        return (value ? true : false);
    },

    toSqlType: function(value) {
        if (value == null && this.isNullable()) {
            return null;
        }

        return (value ? 1 : 0);
    }
});


/**
 * Real type.
 */
Database.Types.Real = Class.create(Database.Types.BaseType, {
    SqlType: "REAL",

    initialize: function($super, nullable) {
        $super(nullable);
    }
});