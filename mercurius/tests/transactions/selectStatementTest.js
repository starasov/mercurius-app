Transactions.SelectStatementTest = Class.create({
    before: function() {
        this.statement = new Transactions.SelectStatement(Transactions.TableModel);
        return Mojo.Test.beforeFinished;
    },

    test_should_correctly_build_join_clause: function() {
        var context = this.statement.toSelectSql({}, {});

        Mojo.requireEqual(
                "SELECT transactions.id AS id, transactions.type AS type, transactions.amount AS amount, transactions.date AS date, " +
                       "transactions.account_id AS account_id, transactions.category_id AS category_id, " +
                       "accounts.name AS account_name, categories.name AS category_name, " +
                       "categories.type AS category_type, currencies.symbol AS currency_symbol " +
                "FROM transactions " +
                "LEFT JOIN accounts ON transactions.account_id = accounts.id " +
                "LEFT JOIN categories ON transactions.category_id = categories.id " +
                "LEFT JOIN currencies ON accounts.currency_id = currencies.id;", context.sql);

        return Mojo.Test.passed;
    }
});