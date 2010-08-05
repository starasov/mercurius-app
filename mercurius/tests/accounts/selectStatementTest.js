Accounts.SelectStatementTest = Class.create({
    before: function() {
        this.statement = new Accounts.SelectStatement(Accounts.TableModel);
        return Mojo.Test.beforeFinished;
    },

    test_should_correctly_build_join_clause: function() {
        var context = this.statement.toSelectSql({}, {});

        Mojo.requireEqual(
                "SELECT accounts.id AS id, accounts.name AS name, accounts.opening_balance AS opening_balance, " +
                       "accounts.currency_id AS currency_id, accounts.closed_flag AS closed_flag, " +
                       "currencies.name AS currency_name, currencies.symbol AS currency_symbol " +
                "FROM accounts " +
                "LEFT JOIN currencies ON accounts.currency_id = currencies.id;", context.sql);

        return Mojo.Test.passed;
    }
});